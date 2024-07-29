import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define protected routes
const isProtectedRoute = createRouteMatcher([
	"/reports/add",
	"/reports/:id/edit",
	"/profile",
	"/reports/bookmarks",
	"/messages",
]);

export default clerkMiddleware((auth, req) => {
	if (isProtectedRoute(req)) {
		auth().protect();
	}
});

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
