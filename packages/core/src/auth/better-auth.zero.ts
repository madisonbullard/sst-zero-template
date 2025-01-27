import { boolean, number, relationships, string, table } from "@rocicorp/zero";

export const userSchema = table("user")
	.columns({
		id: string(),
		name: string(),
		email: string(),
		emailVerified: boolean(),
		image: string().optional(),
		createdAt: number(),
		updatedAt: number(),
	})
	.primaryKey("id");

export const sessionSchema = table("session")
	.columns({
		id: string(),
		expiresAt: number(),
		token: string(),
		ipAddress: string().optional(),
		userAgent: string().optional(),
		userId: string(),
		createdAt: number(),
		updatedAt: number(),
	})
	.primaryKey("id");

export const sessionRelationships = relationships(sessionSchema, ({ one }) => ({
	user: one({
		sourceField: ["userId"],
		destField: ["id"],
		destSchema: userSchema,
	}),
}));

export const accountSchema = table("account")
	.columns({
		id: string(),
		accountId: string(),
		providerId: string(),
		userId: string(),
		accessToken: string().optional(),
		refreshToken: string().optional(),
		idToken: string().optional(),
		accessTokenExpiresAt: number().optional(),
		refreshTokenExpiresAt: number().optional(),
		scope: string().optional(),
		password: string().optional(),
		createdAt: number(),
		updatedAt: number(),
	})
	.primaryKey("id");

export const accountRelationships = relationships(accountSchema, ({ one }) => ({
	user: one({
		sourceField: ["userId"],
		destField: ["id"],
		destSchema: userSchema,
	}),
}));

export const verificationSchema = table("verification")
	.columns({
		id: string(),
		identifier: string(),
		value: string(),
		expiresAt: number(),
		createdAt: number(),
		updatedAt: number(),
	})
	.primaryKey("id");

export const jwksSchema = table("jwks")
	.columns({
		id: string(),
		publicKey: string(),
		privateKey: string(),
		createdAt: number(),
	})
	.primaryKey("id");
2;
