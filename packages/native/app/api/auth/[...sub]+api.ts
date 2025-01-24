import { auth } from "core/auth/index";
import type { Endpoint } from "one";

export const GET: Endpoint = async (req) => {
	return await auth.handler(req);
};

export const POST: Endpoint = async (req) => {
	return await auth.handler(req);
};
