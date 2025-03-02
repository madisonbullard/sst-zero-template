import {
	ANYONE_CAN,
	type Row,
	createSchema,
	definePermissions,
} from "@rocicorp/zero";
import { foo } from "@sst-zero-template/core/foo/foo.zero";

export const schema = createSchema(1, {
	tables: [foo],
});

export type Schema = typeof schema;

export type Foo = Row<typeof schema.tables.foo>;

// This should match whatever data is on the JWT token used to authenticate the user
export type AuthData = {
	userId: string;
	email: string;
};

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
	return {
		foo: {
			row: {
				delete: ANYONE_CAN,
				insert: ANYONE_CAN,
				update: {
					preMutation: ANYONE_CAN,
					postMutation: ANYONE_CAN,
				},
				select: ANYONE_CAN,
			},
		},
	};
});
