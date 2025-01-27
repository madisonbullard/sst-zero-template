import { type Row, createSchema, definePermissions } from "@rocicorp/zero";
import {
	accountRelationships,
	accountSchema,
	jwksSchema,
	sessionRelationships,
	sessionSchema,
	userSchema,
	verificationSchema,
} from "../auth/better-auth.zero";

export const schema = createSchema(1, {
	tables: [
		userSchema,
		sessionSchema,
		accountSchema,
		verificationSchema,
		jwksSchema,
	],
	relationships: [sessionRelationships, accountRelationships],
});

export type Schema = typeof schema;

export type Account = Row<typeof schema.tables.account>;
export type Jwks = Row<typeof schema.tables.jwks>;
export type Session = Row<typeof schema.tables.session>;
export type User = Row<typeof schema.tables.user>;
export type Verification = Row<typeof schema.tables.verification>;

export const permissions = definePermissions(schema, () => {
	return {};
});
