const devVpcId = "";
if ($app.stage !== "production" && $app.stage !== "dev" && !devVpcId) {
	throw new Error(
		`You need to declare the dev infra VPC ID so that this stage can use it, instead of creating another VPC per stage (which would needlessly cost $$$).
		After populating your .env file with your AWS profile and SSO session, you can get a list of your VPC IDs by running \`source .env aws ec2 describe-vpcs --query 'Vpcs[*].VpcId' --output text\`.
		If you have multiple VPCs, you might need to go into AWS dashboard to verify which VPC is relevant to this app.
		If you have no VPCs deployed, you probably need to create the \`dev\` stage: \`pnpm sst dev --stage dev\`.
		Once you have the VPC ID, update \`devVpcId\` in \`infra/database.ts\`.`,
	);
}

export const vpc =
	$app.stage === "production" || $app.stage === "dev"
		? new sst.aws.Vpc("Vpc", {
				bastion: true,
			})
		: sst.aws.Vpc.get("Vpc", devVpcId);

export const zeroDb = new sst.aws.Postgres("ZeroDatabase", {
	vpc,
	transform: {
		parameterGroup: {
			parameters: [
				{
					name: "rds.logical_replication",
					value: "1",
					applyMethod: "pending-reboot",
				},
				{
					name: "rds.force_ssl",
					value: "0",
					applyMethod: "pending-reboot",
				},
				{
					name: "max_connections",
					value: "1000",
					applyMethod: "pending-reboot",
				},
				...($app.stage === "production"
					? []
					: [
							{
								name: "max_slot_wal_keep_size",
								value: "1024",
							},
						]),
			],
		},
	},
});

const connection = $interpolate`postgres://${zeroDb.username}:${zeroDb.password}@${zeroDb.host}:${zeroDb.port}`;
const upstreamDbConnection = $interpolate`${connection}/${zeroDb.database}`;

const ZERO_CVR_DB_NAME = $interpolate`${zeroDb.database}_cvr`;
const ZERO_CHANGE_DB_NAME = $interpolate`${zeroDb.database}_change`;

export const cluster = new sst.aws.Cluster("Cluster", { vpc });

if ($app.stage === "production") {
	throw new Error(
		"ZERO_AUTH_JWKS_URL is not configured for production (needs to point to something other than localhost).",
	);
}
cluster.addService("Zero", {
	image: "rocicorp/zero",
	dev: {
		command: "pnpm zero-cache-dev -p src/zero/index.ts -o zero-schema.json",
		directory: "packages/core",
	},
	loadBalancer: {
		ports: [{ listen: "80/http", forward: "4848/http" }],
	},
	environment: {
		ZERO_UPSTREAM_DB: upstreamDbConnection,
		ZERO_CVR_DB: $interpolate`${connection}/${ZERO_CVR_DB_NAME}`,
		ZERO_CHANGE_DB: $interpolate`${connection}/${ZERO_CHANGE_DB_NAME}`,
		ZERO_REPLICA_FILE: "zero.db",
		ZERO_NUM_SYNC_WORKERS: "1",
		LOG_LEVEL: $app.stage === "production" ? "info" : "debug",
		ZERO_SCHEMA_FILE: "zero-schema.json",
		ZERO_AUTH_JWKS_URL: "http://localhost:8081/api/auth/jwks",
	},
});

export const dbProperties = new sst.Linkable("DbProperties", {
	properties: {
		connectionString: connection,
		ZERO_CHANGE_DB_NAME,
		ZERO_CVR_DB_NAME,
		ZERO_UPSTREAM_DB_NAME: zeroDb.database,
	},
});

export const drizzleStudio = new sst.x.DevCommand("DrizzleStudio", {
	dev: {
		command: "pnpm db:studio",
		directory: "packages/core",
	},
});

export const outputs = {
	instance: connection,
};
