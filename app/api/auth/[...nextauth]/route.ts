import { authOptions } from "@/utils/authOptions";
import NextAuth from "next-auth/next";
import { standardRateLimit } from "@/utils/ratelimit";

const handler = NextAuth(authOptions);

export async function GET(req: Request) {
	const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
	const { success } = await standardRateLimit.limit(ip);
	if (!success) {
		return new Response("Too many requests", { status: 429 });
	}
	return handler(req);
}

export async function POST(req: Request) {
	const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
	const { success } = await standardRateLimit.limit(ip);
	if (!success) {
		return new Response("Too many requests", { status: 429 });
	}
	return handler(req);
}
