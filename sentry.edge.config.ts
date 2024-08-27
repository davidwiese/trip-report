// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === "production";

Sentry.init({
	dsn: "https://adbf9c6d6049ba0c58ce09721bf1423c@o4507850105356288.ingest.us.sentry.io/4507850107781120",

	// Adjust this value in production, or use tracesSampler for greater control
	tracesSampleRate: isProd ? 0.1 : 1,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: !isProd,
});