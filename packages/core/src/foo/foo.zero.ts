import { boolean, string, table } from "@rocicorp/zero";

export const foo = table("foo")
	.columns({
		id: string(),
		title: string(),
		completed: boolean(),
	})
	.primaryKey("id");
