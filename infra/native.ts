import { dbProperties } from "./database";
import { secret } from "./secret";

if ($app.stage === "production") {
	throw new Error(
		"Need to set VITE_PUBLIC_ZERO_SERVER for prod stage in infra/native.ts",
	);
}

export const native = new sst.x.DevCommand("Native", {
	dev: {
		command: "pnpm --filter native dev",
		title: "Native",
	},
	link: [dbProperties, secret.GithubClientId, secret.GithubClientSecret],
	environment: {
		VITE_PUBLIC_ZERO_SERVER: "http://localhost:4848",
	},
});
