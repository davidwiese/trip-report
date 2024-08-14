import connectDB from "@/config/database";
import Report from "@/models/Report";
import User from "@/models/User";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = "https://www.tripreport.co";

	// Connect to the database
	await connectDB();

	// Fetch all reports
	const reports = await Report.find({}, "_id updatedAt").lean();

	// Fetch all user profiles
	const users = await User.find({}, "_id updatedAt").lean();

	// Static routes
	const routes = [
		"",
		"/reports",
		"/reports/add",
		"/reports/bookmarks",
		"/auth/signin",
		"/contact",
		"/messages",
		"/privacy-policy",
		"/terms",
	].map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date().toISOString(),
	}));

	// Dynamic routes for reports
	const reportRoutes = reports.map((report) => ({
		url: `${baseUrl}/reports/${report._id}`,
		lastModified: report.updatedAt.toISOString(),
	}));

	// Dynamic routes for user profiles
	const userRoutes = users.map((user) => ({
		url: `${baseUrl}/profile/${user._id}`,
		lastModified: user.updatedAt.toISOString(),
	}));

	return [...routes, ...reportRoutes, ...userRoutes];
}
