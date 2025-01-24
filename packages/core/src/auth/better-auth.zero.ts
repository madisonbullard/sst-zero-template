import type { Row } from "@rocicorp/zero";

export const userSchema = {
	tableName: "user",
	primaryKey: ["id"],
	columns: {
		id: "string",
		name: "string",
		email: "string",
		emailVerified: "boolean",
		image: { type: "string", optional: true },
		createdAt: "number",
		updatedAt: "number",
	},
} as const;

export const sessionSchema = {
	tableName: "session",
	primaryKey: ["id"],
	columns: {
		id: "string",
		expiresAt: "number",
		token: "string",
		ipAddress: { type: "string", optional: true },
		userAgent: { type: "string", optional: true },
		userId: "string",
		createdAt: "number",
		updatedAt: "number",
	},
	relationships: {
		user: {
			sourceField: "userId",
			destField: "id",
			destSchema: () => userSchema,
		},
	},
} as const;

export const accountSchema = {
	tableName: "account",
	primaryKey: ["id"],
	columns: {
		id: "string",
		accountId: "string",
		providerId: "string",
		userId: "string",
		accessToken: { type: "string", optional: true },
		refreshToken: { type: "string", optional: true },
		idToken: { type: "string", optional: true },
		accessTokenExpiresAt: { type: "number", optional: true },
		refreshTokenExpiresAt: { type: "number", optional: true },
		scope: { type: "string", optional: true },
		password: { type: "string", optional: true },
		createdAt: "number",
		updatedAt: "number",
	},
	relationships: {
		user: {
			sourceField: "userId",
			destField: "id",
			destSchema: () => userSchema,
		},
	},
} as const;

export const verificationSchema = {
	tableName: "verification",
	primaryKey: ["id"],
	columns: {
		id: "string",
		identifier: "string",
		value: "string",
		expiresAt: "number",
		createdAt: { type: "number", optional: true },
		updatedAt: { type: "number", optional: true },
	},
} as const;

export const jwksSchema = {
	tableName: "jwks",
	primaryKey: ["id"],
	columns: {
		id: "string",
		publicKey: "string",
		privateKey: "string",
		createdAt: "number",
	},
} as const;

export type User = Row<typeof userSchema>;
export type Session = Row<typeof sessionSchema>;
export type Account = Row<typeof accountSchema>;
export type Verification = Row<typeof verificationSchema>;
export type Jwks = Row<typeof jwksSchema>;
