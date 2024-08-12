const nextConfig = {
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
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{ key: "Access-Control-Allow-Credentials", value: "true" },
					{
						key: "Access-Control-Allow-Origin",
						value: [
							"https://www.tripreport.co",
							"https://tripreport.co",
							"https://accounts.tripreport.co",
						],
					},
					{
						key: "Access-Control-Allow-Methods",
						value: "GET,DELETE,PATCH,POST,PUT,OPTIONS",
					},
					{
						key: "Access-Control-Allow-Headers",
						value:
							"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, svix-id, svix-signature, svix-timestamp",
					},
				],
			},
		];
	},
};

export default nextConfig;
