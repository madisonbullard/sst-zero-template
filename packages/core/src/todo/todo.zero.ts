import { boolean, string, table } from "@rocicorp/zero";

export const todoSchema = table("todo")
	.columns({
		id: string(),
		title: string(),
		completed: boolean(),
	})
	.primaryKey("id");
