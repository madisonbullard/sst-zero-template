import {
	type Query,
	type QueryType,
	type Smash,
	type TableSchema,
	Zero,
} from "@rocicorp/zero";
import { useZero, useQuery as useZeroQuery } from "@rocicorp/zero/react";
import { createEmitter } from "@vxrn/emitter";
import { type Schema, schema } from "core/zero/index";

export let zero = createZero();

const zeroEmitter = createEmitter<typeof zero>();
export const useZeroEmit = zeroEmitter.use;

function createZero({
	auth,
	userID = "anon",
}: { auth?: string; userID?: string } = {}) {
	return new Zero({
		userID,
		auth,
		server: import.meta.env.VITE_PUBLIC_ZERO_SERVER,
		schema: schema,
	});
}

export function setZeroAuth({
	jwtToken,
	userID,
}: { jwtToken: string; userID: string }) {
	zero = createZero({
		auth: jwtToken,
		userID,
	});
	zeroEmitter.emit(zero);
}

export type QueryResult<TReturn extends QueryType> = [
	Smash<TReturn>,
	{
		type: "unknown" | "complete";
	},
];

export function useQuery<
	T extends TableSchema,
	QueryBuilder extends (z: Zero<Schema>["query"]) => Query<T>,
	Q extends ReturnType<QueryBuilder>,
>(
	createQuery: QueryBuilder,
): Q extends Query<T, infer Return> ? QueryResult<Return> : never {
	const z = useZero<Schema>();
	return useZeroQuery(createQuery(z.query)) as Q extends Query<
		T,
		infer Return extends QueryType
	>
		? QueryResult<Return>
		: never;
}
