import { timestamp as rawTs } from "drizzle-orm/pg-core";

const timestamp = (name: string) => rawTs(name, { precision: 3, mode: "date" });

export const timestamps = {
	timeCreated: timestamp("timeCreated").notNull().defaultNow(),
	timeUpdated: timestamp("timeUpdated").notNull().defaultNow(),
	timeDeleted: timestamp("timeDeleted"),
};

export const zeroTimestamps = {
	createdAt: "number",
	updatedAt: "number",
	deletedAt: "number",
} as const;
