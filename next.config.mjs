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
};

export default nextConfig;
