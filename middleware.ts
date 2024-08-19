import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
	"/reports/add",
	"/reports/:id/edit",
	"/profile",
	"/reports/bookmarks",
	"/messages",
]);

const allowedOrigins = [
	"https://www.tripreport.co",
	"https://tripreport.co",
	"https://accounts.tripreport.co",
];

const secretKey =
	process.env.NODE_ENV === "production"
		? process.env.CLERK_SECRET_KEY
		: process.env.CLERK_SECRET_KEY_DEV || process.env.CLERK_SECRET_KEY;

// Add your ngrok URL to allowed origins for development
if (process.env.NODE_ENV === "development") {
	allowedOrigins.push("https://suddenly-legal-dinosaur.ngrok-free.app");
	allowedOrigins.push("http://localhost:3000");
	allowedOrigins.push("https://strong-trout-33.accounts.dev");
	allowedOrigins.push("https://strong-trout-33.clerk.accounts.dev");
}

export default clerkMiddleware(
	(auth, req) => {
		console.log("Middleware running for URL:", req.url);
		console.log("Is protected route:", isProtectedRoute(req));
		console.log("User ID:", auth().userId);
		console.log("Session ID:", auth().sessionId);
		console.log("Using secret key:", secretKey ? "Set" : "Not set");

		const session = auth().sessionId;
		console.log("Full Session Object:", session);

		const cookies = req.headers.get("cookie");
		console.log("Cookies:", cookies); // Log the cookies to see if the __session cookie is present

		if (isProtectedRoute(req)) {
			auth().protect();
		}

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
	{ debug: process.env.NODE_ENV === "development", secretKey: secretKey }
);

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
