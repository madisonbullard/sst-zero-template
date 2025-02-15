import { vpc } from "./network";

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
					name: "max_slot_wal_keep_size",
					value: "10240",
					applyMethod: "pending-reboot",
				},
			],
		},
	},
});

const connection = $interpolate`postgres://${zeroDb.username}:${zeroDb.password}@${zeroDb.host}:${zeroDb.port}`;

export const dbProperties = new sst.Linkable("DbProperties", {
	properties: {
		connectionString: connection,
		ZERO_UPSTREAM_DB_NAME: zeroDb.database,
	},
});

export const drizzleStudio = new sst.x.DevCommand("DrizzleStudio", {
	dev: {
		command: "bun db:studio",
		directory: "packages/core",
	},
});

export const outputs = {
	instance: connection,
};
