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
	"http://localhost:3000",
];

// Add your ngrok URL to allowed origins for development
if (process.env.NODE_ENV === "development") {
	allowedOrigins.push("https://suddenly-legal-dinosaur.ngrok-free.app");
}

export default clerkMiddleware((auth, req) => {
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
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
