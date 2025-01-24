import { defineConfig } from "drizzle-kit";
import { Resource } from "sst";

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/**/*.sql.ts",
	out: "./migrations",
	strict: true,
	verbose: true,
	dbCredentials: {
		url: `${Resource.DbProperties.connectionString}/${Resource.DbProperties.ZERO_UPSTREAM_DB_NAME}`,
	},
});
