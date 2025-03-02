import { zero } from "./zero";

export const webapp = new sst.aws.SvelteKit("Webapp", {
	path: "packages/webapp",
	environment: {
		VITE_ZERO_SERVER_URL: zero.url,
	},
});

export const outputs = {
	webapp: webapp.url,
};
