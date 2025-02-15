import { secret } from "./secret";

if ($app.stage === "production") {
	throw new Error(
		"VITE_ZERO_SERVER_URL must be configured for use in production in infra/webapp.ts",
	);
}
export const webapp = new sst.aws.SvelteKit("Webapp", {
	link: [secret.GithubClientId, secret.GithubClientSecret],
	path: "packages/webapp",
	environment: {
		VITE_ZERO_SERVER_URL: "http://localhost:4848",
	},
});

export const outputs = {
	webapp: webapp.url,
};
