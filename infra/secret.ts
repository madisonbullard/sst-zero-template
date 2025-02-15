export const secret = {
	GithubClientId: new sst.Secret("GithubClientId"),
	GithubClientSecret: new sst.Secret("GithubClientSecret"),
	ZeroAuthSecret: new sst.Secret("ZeroAuthSecret"), // Generate your own: `bun sst secret set ZeroAuthSecret $(openssl rand -base64 64)`
};
