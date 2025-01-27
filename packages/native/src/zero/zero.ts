import { Zero } from "@rocicorp/zero";
import { useZero as useZeroBase } from "@rocicorp/zero/react";
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

export function useZero() {
	return useZeroBase<Schema>();
}
