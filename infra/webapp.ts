import { secret } from "./secret";

export const webapp = new sst.aws.SvelteKit("Webapp", {
	link: [secret.GithubClientId, secret.GithubClientSecret],
});

export const outputs = {
	webapp: webapp.url,
};
