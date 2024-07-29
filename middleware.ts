import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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

	const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
	const cspHeader = `
  default-src 'self';
  script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://clerk.accounts.dev https://*.clerk.accounts.dev https://cdn.jsdelivr.net https://js.sentry-cdn.com https://browser.sentry-cdn.com https://*.ingest.sentry.io https://challenges.cloudflare.com https://scdn.clerk.com https://segapi.clerk.com https://app.posthog.com;
  style-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net;
  img-src 'self' https: data: blob:;
  font-src 'self' https: data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  frame-src 'self' https://*.clerk.accounts.dev https://app.posthog.com;
  connect-src 'self' https://*.clerk.accounts.dev https://*.ingest.sentry.io https://app.posthog.com https://api.cloudinary.com https://api.resend.com;
  media-src 'self' https://res.cloudinary.com;
  worker-src 'self' blob:;
  upgrade-insecure-requests;
`;

	const contentSecurityPolicyHeaderValue = cspHeader
		.replace(/\s{2,}/g, " ")
		.trim();

	const requestHeaders = new Headers(req.headers);
	requestHeaders.set("x-nonce", nonce);
	requestHeaders.set(
		"Content-Security-Policy",
		contentSecurityPolicyHeaderValue
	);

	const response = NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});
	response.headers.set(
		"Content-Security-Policy",
		contentSecurityPolicyHeaderValue
	);

	return response;
});

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
		{
			source: "/(.*)",
			missing: [
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},
	],
};
