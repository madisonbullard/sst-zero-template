/// <reference path="./.sst/platform/config.d.ts" />
import { readdirSync } from "node:fs";
export default $config({
	app(input) {
		return {
			name: "sst-zero-template",
			removal: input?.stage === "production" ? "retain" : "remove",
			home: "aws",
			providers: {
				aws: {
					region: "us-east-1",
					profile: process.env.AWS_PROFILE,
				},
				command: "1.0.2",
			},
		};
	},
	async run() {
		const outputs = {};
		for (const value of readdirSync("./infra/")) {
			const result = await import(`./infra/${value}`);
			if (result.outputs) Object.assign(outputs, result.outputs);
		}
		return outputs;
	},
});
