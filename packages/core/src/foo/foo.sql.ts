import { boolean, pgTable, text } from "drizzle-orm/pg-core";

export const foo = pgTable("foo", {
	id: text("id").primaryKey(),
	title: text("title").notNull(),
	completed: boolean("completed").notNull(),
});
