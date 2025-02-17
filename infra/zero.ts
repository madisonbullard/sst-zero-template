import { execSync } from "node:child_process";
import { join } from "node:path";
import { cluster } from "./cluster";
import { dbProperties } from "./database";
import { secret } from "./secret";
import { storage } from "./storage";

const conn = dbProperties.properties.connectionString;

const tag = $dev
	? "latest"
	: execSync(
			"npm list @rocicorp/zero | grep @rocicorp/zero | cut -f 3 -d @ | cut -d ' ' -f 1 | head -n 1",
		)
			.toString()
			.trim();
const image = `registry.hub.docker.com/rocicorp/zero:${tag}`;

const zeroEnv = {
	// NO_COLOR: "1",
	// FORCE: "1",
	ZERO_LOG_LEVEL: "info",
	ZERO_UPSTREAM_DB: conn,
	ZERO_CVR_DB: conn,
	ZERO_CHANGE_DB: conn,
	ZERO_REPLICA_FILE: "zero.db",
	ZERO_LITESTREAM_RESTORE_PARALLELISM: "64",
	ZERO_SHARD_ID: $app.stage,
	ZERO_AUTH_SECRET: secret.ZeroAuthSecret.value,
	...($dev
		? {}
		: {
				ZERO_LITESTREAM_BACKUP_URL: $interpolate`s3://${storage.name}/zero-backups/${tag}/1`,
			}),
};

const replication = !$dev
	? new sst.aws.Service("ZeroReplication", {
			cluster,
			...($app.stage === "production"
				? {
						cpu: "1 vCPU",
						memory: "2 GB",
					}
				: {}),
			image,
			link: [dbProperties, storage],
			health: {
				command: ["CMD-SHELL", "curl -f http://localhost:4849/ || exit 1"],
				interval: "5 seconds",
				retries: 3,
				startPeriod: "300 seconds",
			},
			loadBalancer: {
				rules: [
					{
						listen: "80/http",
						forward: "4849/http",
					},
				],
				public: false,
			},
			environment: {
				...zeroEnv,
				ZERO_CHANGE_MAX_CONNS: "3",
				ZERO_NUM_SYNC_WORKERS: "0",
			},
			logging: {
				retention: "1 month",
			},
			transform: {
				taskDefinition: {
					ephemeralStorage: {
						sizeInGib: 200,
					},
				},
				loadBalancer: {
					idleTimeout: 60 * 60,
				},
				target: {
					deregistrationDelay: 1, // Drain as soon as a new instance is healthy.
				},
			},
		})
	: undefined;

export const zero = new sst.aws.Service("Zero", {
	cluster,
	image,
	link: [dbProperties, storage],
	...($app.stage === "production"
		? {
				cpu: "2 vCPU",
				memory: "4 GB",
			}
		: {}),
	environment: {
		...zeroEnv,
		...($dev
			? {
					ZERO_NUM_SYNC_WORKERS: "1",
				}
			: {
					// biome-ignore lint/style/noNonNullAssertion: `repliction` will always be defined when !$dev
					ZERO_CHANGE_STREAMER_URI: replication!.url,
					ZERO_UPSTREAM_MAX_CONNS: "15",
					ZERO_CVR_MAX_CONNS: "160",
				}),
	},
	health: {
		command: ["CMD-SHELL", "curl -f http://localhost:4848/ || exit 1"],
		interval: "5 seconds",
		retries: 3,
		startPeriod: "300 seconds",
	},
	loadBalancer: {
		rules: [
			// If you use a custom domain, you will want to change "433/http" to "433/https"
			{ listen: "443/http", forward: "4848/http" },
			{ listen: "80/http", forward: "4848/http" },
		],
	},
	scaling: {
		min: 1,
		max: 4,
	},
	transform: {
		taskDefinition: {
			ephemeralStorage: {
				sizeInGib: 200,
			},
		},
		service: {
			waitForSteadyState: true,
		},
		loadBalancer: {
			idleTimeout: 60 * 60,
		},
	},
	dev: {
		command: "bun zero:dev",
		directory: "packages/core",
		url: "http://localhost:4848",
	},
	// Set this to `true` to make SST wait for the view-syncer to be deployed
	// before proceeding (to permissions deployment, etc.). This makes the deployment
	// take a lot longer and is only necessary if there is an AST format change.
	wait: !$dev,
});

new command.local.Command(
	"zero-deploy-permissions",
	{
		dir: join(process.cwd(), "packages/core"),
		create: "npx zero-deploy-permissions -p src/zero/schema.ts",
		environment: {
			ZERO_UPSTREAM_DB: $interpolate`${conn}/${dbProperties.properties.ZERO_UPSTREAM_DB_NAME}`,
		},
		triggers: [Date.now()],
	},
	{
		dependsOn: zero,
	},
);
