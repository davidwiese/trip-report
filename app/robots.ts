import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/api/",
					"/auth/",
					"/actions/",
					"/messages/",
					"/reports/*/edit",
					"/reports/add",
					"/reports/bookmarks",
					"/reports/search-results",
					"/profile/", // Disallow the general /profile/ path
				],
			},
			{
				userAgent: "*",
				allow: "/profile/*", // Allow specific profile pages
			},
		],
		sitemap: "https://www.tripreport.co/sitemap.xml",
		host: "https://www.tripreport.co",
	};
}
