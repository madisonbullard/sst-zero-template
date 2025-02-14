import {
	ANYONE_CAN,
	type Row,
	createSchema,
	definePermissions,
} from "@rocicorp/zero";
import {
	accountRelationships,
	accountSchema,
	jwksSchema,
	sessionRelationships,
	sessionSchema,
	userSchema,
	verificationSchema,
} from "../auth/better-auth.zero";
import { todoSchema } from "../todo/todo.zero";

export const schema = createSchema(1, {
	tables: [
		userSchema,
		sessionSchema,
		accountSchema,
		verificationSchema,
		jwksSchema,
		todoSchema,
	],
	relationships: [sessionRelationships, accountRelationships],
});

export type Schema = typeof schema;

export type Account = Row<typeof schema.tables.account>;
export type Jwks = Row<typeof schema.tables.jwks>;
export type Session = Row<typeof schema.tables.session>;
export type User = Row<typeof schema.tables.user>;
export type Verification = Row<typeof schema.tables.verification>;
export type Todo = Row<typeof schema.tables.todo>;

export const permissions = definePermissions<Session, Schema>(schema, () => {
	return {
		todo: {
			row: {
				delete: ANYONE_CAN,
				insert: ANYONE_CAN,
			},
		},
	};
});
