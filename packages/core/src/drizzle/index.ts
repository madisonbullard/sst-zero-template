import { drizzle } from "drizzle-orm/node-postgres";
import { Resource } from "sst";

export const db = drizzle(
	`${Resource.DbProperties.connectionString}/${Resource.DbProperties.ZERO_UPSTREAM_DB_NAME}`,
);
