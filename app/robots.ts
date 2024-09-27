import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: [
				"/messages/",
				"/profile/",
				"/reports/*/edit",
				"/reports/add",
				"/reports/bookmarks",
				"/reports/search-results",
			],
		},
		sitemap: "https://www.tripreport.co/sitemap.xml",
		host: "https://www.tripreport.co",
	};
}
