const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				pathname: "**",
			},
			{ protocol: "https", hostname: "res.cloudinary.com", pathname: "**" },
			{ protocol: "https", hostname: "img.clerk.com", pathname: "**" },
		],
	},
	env: {
		CLERK_SECRET_KEY:
			process.env.NODE_ENV === "production"
				? process.env.CLERK_SECRET_KEY
				: process.env.CLERK_SECRET_KEY_DEV || process.env.CLERK_SECRET_KEY,
	},
};

export default nextConfig;
