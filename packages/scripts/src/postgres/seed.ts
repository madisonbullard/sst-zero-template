import pg from "pg";
import { Resource } from "sst";

/**
 * This file creates the databases for the Zero application
 */

const connectionString = `${Resource.DbProperties.connectionString}/postgres`;

const dbsToCreate = [
	Resource.DbProperties.ZERO_UPSTREAM_DB_NAME,
	Resource.DbProperties.ZERO_CVR_DB_NAME,
	Resource.DbProperties.ZERO_CHANGE_DB_NAME,
];

console.info(`Connecting to: ${connectionString}/postgres`);

const pool = new pg.Pool({
	connectionString,
});

async function createDatabases() {
	const client = await connectWithRetry();
	try {
		for (const dbName of dbsToCreate) {
			try {
				console.log(`Creating database ${dbName}`);
				await client.query(`CREATE DATABASE ${dbName}`);
			} catch (e: unknown) {
				if (
					e &&
					typeof e === "object" &&
					"message" in e &&
					typeof e.message === "string" &&
					e.message.includes("already exists")
				) {
					console.info(`Database ${dbName} already exists`);
				} else {
					console.error(`Failed to create database ${dbName}:`, e);
					throw e;
				}
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
	createDatabases()
		.then(() => {
			console.info("Seeding complete");
			process.exit(0);
		})
		.catch((err) => {
			console.error("Error seeding:", err);
			process.exit(1);
		});
});
