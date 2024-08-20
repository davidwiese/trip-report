import connectDB from "@/config/database";
import Report from "@/models/Report";
import User from "@/models/User";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = "https://www.tripreport.co";

	await connectDB();

	// Fetch all reports
	const reports = await Report.find({}, "_id updatedAt").lean();

	// Fetch all user profiles
	const users = await User.find({}, "_id updatedAt").lean();

	// Static routes
	const routes = [
		{ url: `${baseUrl}`, changefreq: "daily", priority: 1 },
		{ url: `${baseUrl}/reports`, changefreq: "daily", priority: 0.8 },
		{ url: `${baseUrl}/contact`, changefreq: "monthly", priority: 0.5 },
		{ url: `${baseUrl}/privacy-policy`, changefreq: "yearly", priority: 0.3 },
		{ url: `${baseUrl}/terms`, changefreq: "yearly", priority: 0.3 },
	].map((route) => ({
		...route,
		lastModified: new Date().toISOString(),
	}));

	// Dynamic routes for reports
	const reportRoutes = reports.map((report) => ({
		url: `${baseUrl}/reports/${report._id}`,
		lastModified: report.updatedAt.toISOString(),
		changefreq: "daily" as const,
		priority: 0.8,
	}));

	// Dynamic routes for user profiles
	const userRoutes = users.map((user) => ({
		url: `${baseUrl}/profile/${user._id}`,
		lastModified: user.updatedAt.toISOString(),
		changefreq: "daily" as const,
		priority: 0.7,
	}));

	return [...routes, ...reportRoutes, ...userRoutes];
}
