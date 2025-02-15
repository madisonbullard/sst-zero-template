import {
	ANYONE_CAN,
	type Row,
	createSchema,
	definePermissions,
} from "@rocicorp/zero";

import { todo } from "../todo/todo.zero";

export const schema = createSchema(1, {
	tables: [todo],
});

export type Schema = typeof schema;

export type Todo = Row<typeof schema.tables.todo>;

// This should match whatever data is on the JWT token used to authenticate the user
export type AuthData = {
	userId: string;
	email: string;
};

export const permissions = definePermissions<AuthData, Schema>(schema, () => {
	return {
		todo: {
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
