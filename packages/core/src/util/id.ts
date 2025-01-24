import { customAlphabet } from "nanoid/non-secure";

const nanoid = customAlphabet(
	"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
);

const prefixes = {
	file: "fil",
} as const;

export function createId(prefix: keyof typeof prefixes): string {
	return [prefixes[prefix], nanoid(16)].join("_");
}
