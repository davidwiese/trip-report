// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const isProd = process.env.NODE_ENV === "production";

Sentry.init({
	dsn: "https://adbf9c6d6049ba0c58ce09721bf1423c@o4507850105356288.ingest.us.sentry.io/4507850107781120",

	// Adjust this value in production, or use tracesSampler for greater control
	tracesSampleRate: isProd ? 0.1 : 1,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: !isProd,
	replaysOnErrorSampleRate: 1.0,

	// This sets the sample rate to be 10%. You may want this to be 100% while
	// in development and sample at a lower rate in production
	replaysSessionSampleRate: isProd ? 0.1 : 1,

	// You can remove this option if you're not planning to use the Sentry Session Replay feature:
	integrations: [
		Sentry.replayIntegration({
			// Additional Replay configuration goes in here, for example:
			maskAllText: true,
			blockAllMedia: true,
		}),
	],
});