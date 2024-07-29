const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.accounts.dev https://*.clerk.accounts.dev https://cdn.jsdelivr.net https://js.sentry-cdn.com https://browser.sentry-cdn.com https://*.ingest.sentry.io https://challenges.cloudflare.com https://scdn.clerk.com https://segapi.clerk.com https://app.posthog.com;
    style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
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

const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "img.clerk.com",
				pathname: "**",
			},
		],
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "Content-Security-Policy",
						value: cspHeader.replace(/\s{2,}/g, " ").trim(),
					},
				],
			},
		];
	},
};

export default nextConfig;
