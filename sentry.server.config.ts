// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === "production";

Sentry.init({
	dsn: "https://adbf9c6d6049ba0c58ce09721bf1423c@o4507850105356288.ingest.us.sentry.io/4507850107781120",

	// Adjust this value in production, or use tracesSampler for greater control
	tracesSampleRate: isProd ? 0.1 : 1,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: !isProd,

	// Uncomment the line below to enable Spotlight (https://spotlightjs.com)
	// spotlight: process.env.NODE_ENV === 'development',
	spotlight: !isProd,
});
