import { createSchema, definePermissions } from "@rocicorp/zero";
import {
	accountSchema,
	jwksSchema,
	sessionSchema,
	userSchema,
	verificationSchema,
} from "../auth/better-auth.zero";

export const schema = createSchema({
	version: 1,
	tables: {
		user: userSchema,
		session: sessionSchema,
		account: accountSchema,
		verification: verificationSchema,
		jwks: jwksSchema,
	},
});

export type Schema = typeof schema;

export const permissions = definePermissions(schema, () => {
	return {};
});
