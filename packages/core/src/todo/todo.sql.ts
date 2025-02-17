import { boolean, pgTable, text } from "drizzle-orm/pg-core";

export const todo = pgTable("todo", {
	id: text("id").primaryKey(),
	title: text("title").notNull(),
	completed: boolean("completed").notNull(),
	foo: text("foo"),
});
