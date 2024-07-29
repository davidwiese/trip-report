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
						value:
							"default-src 'self'; script-src 'self' https://clerk.accounts.dev https://*.clerk.accounts.dev https://cdn.jsdelivr.net https://js.sentry-cdn.com https://browser.sentry-cdn.com https://*.ingest.sentry.io https://challenges.cloudflare.com https://scdn.clerk.com https://segapi.clerk.com; connect-src 'self' https://*.clerk.accounts.dev https://*.ingest.sentry.io; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; frame-src 'self' https://*.clerk.accounts.dev; font-src 'self' https: data:;",
					},
				],
			},
		];
	},
};

export default nextConfig;
