import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer, jwt } from "better-auth/plugins";
import { db } from "core/drizzle/index";
import { Resource } from "sst";
import * as schema from "./better-auth.sql";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),

	plugins: [
		jwt({
			jwt: {
				expirationTime: "3y",
			},

			jwks: {
				// default
				keyPairConfig: { alg: "EdDSA", crv: "Ed25519" },
			},
		}),

		bearer(),
	],

	socialProviders: {
		github: {
			clientId: Resource.GithubClientId.value,
			clientSecret: Resource.GithubClientSecret.value,
		},
	},
});
