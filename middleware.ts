import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
	"/reports/add",
	"/reports/:id/edit",
	"/profile",
	"/reports/bookmarks",
	"/messages",
]);

const secretKey =
	process.env.NODE_ENV === "production"
		? process.env.CLERK_SECRET_KEY
		: process.env.CLERK_SECRET_KEY_DEV || process.env.CLERK_SECRET_KEY;

const publishableKey =
	process.env.NODE_ENV === "production"
		? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
		: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_DEV ||
		  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const allowedOrigins = [
	"https://www.tripreport.co",
	"https://tripreport.co",
	"https://accounts.tripreport.co",
];

export default clerkMiddleware(
	(auth, req) => {
		// Skip protection for all routes in development
		if (process.env.NODE_ENV === "development") {
			console.log("Development mode: Skipping route protection");
			return NextResponse.next();
		}

		if (isProtectedRoute(req)) auth().protect();

		const res = NextResponse.next();

		const origin = req.headers.get("origin");
		if (origin && allowedOrigins.includes(origin)) {
			res.headers.set("Access-Control-Allow-Origin", origin);
		}

		res.headers.set(
			"Access-Control-Allow-Methods",
			"GET,POST,PUT,DELETE,OPTIONS"
		);
		res.headers.set(
			"Access-Control-Allow-Headers",
			"Content-Type, Authorization, svix-id, svix-signature, svix-timestamp"
		);
		res.headers.set("Access-Control-Allow-Credentials", "true");

		return res;
	},
	{ secretKey: secretKey, publishableKey: publishableKey }
);

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
