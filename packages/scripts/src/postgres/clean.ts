import pg from "pg";
import { Resource } from "sst";

/**
 * This file creates the databases for the Zero application
 */

const connectionString = `${Resource.DbProperties.connectionString}/postgres`;

const dbsToRemove = [
	Resource.DbProperties.ZERO_UPSTREAM_DB_NAME,
	Resource.DbProperties.ZERO_CVR_DB_NAME,
	Resource.DbProperties.ZERO_CHANGE_DB_NAME,
];

console.info(`Connecting to: ${connectionString}/postgres`);

const pool = new pg.Pool({
	connectionString,
});

async function removeDatabases() {
	const client = await connectWithRetry();
	try {
		for (const dbName of dbsToRemove) {
			try {
				console.log(`Removing database ${dbName}`);
				await client.query(`DROP DATABASE ${dbName}`);
			} catch (e: unknown) {
				console.error(`Error removing database ${dbName}: ${e}`);
			}
		}
	} finally {
		client.release();
	}
}

const connectWithRetry = async () => {
	try {
		return await pool.connect();
	} catch (err) {
		console.error(
			`Failed to connect to the database.\n${err}\nRetrying in 5 seconds...`,
		);
		await new Promise((res) => setTimeout(res, 5000));
		return await pool.connect();
	}
};

connectWithRetry().then(() => {
	removeDatabases()
		.then(() => {
			console.info("Removing databases complete");
			process.exit(0);
		})
		.catch((err) => {
			console.error("Error seeding:", err);
			process.exit(1);
		});
});
