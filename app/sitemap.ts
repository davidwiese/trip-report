import connectDB from "@/config/database";
import Report from "@/models/Report";
import User from "@/models/User";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = "https://www.tripreport.co";

	await connectDB();

	// Fetch all reports
	const reports = await Report.find({}, "_id updatedAt")
		.sort({ updatedAt: -1 })
		.limit(1000)
		.lean();

	// Fetch all user profiles
	const users = await User.find({}, "_id updatedAt")
		.sort({ updatedAt: -1 })
		.limit(1000)
		.lean();

	// Static routes
	const routes: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		{
			url: `${baseUrl}/reports`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/contact`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.5,
		},
		{
			url: `${baseUrl}/privacy-policy`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${baseUrl}/terms`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.3,
		},
	];

	// Dynamic routes for reports
	const reportRoutes: MetadataRoute.Sitemap = reports.map((report) => ({
		url: `${baseUrl}/reports/${report._id}`,
		lastModified: report.updatedAt,
		changeFrequency: "weekly",
		priority: 0.7,
	}));

	// Dynamic routes for user profiles
	const userRoutes: MetadataRoute.Sitemap = users.map((user) => ({
		url: `${baseUrl}/profile/${user._id}`,
		lastModified: user.updatedAt,
		changeFrequency: "weekly",
		priority: 0.6,
	}));

	return [...routes, ...reportRoutes, ...userRoutes];
}
