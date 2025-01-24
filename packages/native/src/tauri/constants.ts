export const isTauri =
	// @ts-expect-error
	// biome-ignore lint/complexity/useLiteralKeys: <explanation>
	typeof window !== "undefined" && window["__TAURI__"] !== undefined;
