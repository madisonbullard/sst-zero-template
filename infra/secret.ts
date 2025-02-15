export const secret = {
	ZeroAuthSecret: new sst.Secret("ZeroAuthSecret"), // Generate your own: `bun sst secret set ZeroAuthSecret $(openssl rand -base64 64)`
};
