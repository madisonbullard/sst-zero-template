import { readFileSync } from "node:fs";
import { cluster } from "./cluster";
import { dbProperties, postgres } from "./database";
import { secret } from "./secret";
import { storage } from "./storage";

const conn = dbProperties.properties.connectionString;

const tag = $dev
	? "latest"
	: JSON.parse(
			readFileSync("./node_modules/@rocicorp/zero/package.json").toString(),
		).version.replace("+", "-");
const image = `registry.hub.docker.com/rocicorp/zero:${tag}`;

const zeroEnv = {
	// NO_COLOR: "1",
	// FORCE: "1",
	ZERO_LOG_LEVEL: "info",
	ZERO_LITESTREAM_LOG_LEVEL: "info",
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
						cpu: "2 vCPU",
						memory: "4 GB",
					}
				: {}),
			image,
			wait: true,
			link: [postgres, storage],
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
				service: {
					healthCheckGracePeriodSeconds: 900,
				},
				taskDefinition: {
					ephemeralStorage: {
						sizeInGib: 200,
					},
				},
				loadBalancer: {
					idleTimeout: 60 * 60,
				},
			},
		})
	: undefined;

export const zero = new sst.aws.Service("Zero", {
	cluster,
	image,
	link: [postgres, storage],
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
					// biome-ignore lint/style/noNonNullAssertion: `replication` will always exist when !$dev
					ZERO_CHANGE_STREAMER_URI: replication!.url.apply((val) =>
						val.replace("http://", "ws://"),
					),
					ZERO_UPSTREAM_MAX_CONNS: "15",
					ZERO_CVR_MAX_CONNS: "160",
				}),
	},
	wait: true,
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
		service: {
			healthCheckGracePeriodSeconds: 900,
		},
		taskDefinition: {
			ephemeralStorage: {
				sizeInGib: 200,
			},
		},
		loadBalancer: {
			idleTimeout: 60 * 60,
		},
	},
	dev: {
		command: "bun dev",
		directory: "packages/zero",
		url: "http://localhost:4848",
	},
});

// new command.local.Command(
// 	"zero-deploy-permissions",
// 	{
// 		dir: join(process.cwd(), "packages/zero"),
// 		create: "npx zero-deploy-permissions",
// 		environment: {
// 			ZERO_UPSTREAM_DB: $interpolate`${conn}/${dbProperties.properties.ZERO_UPSTREAM_DB_NAME}`,
// 		},
// 		triggers: [Date.now()],
// 	},
// 	{
// 		dependsOn: zero,
// 	},
// );
