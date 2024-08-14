"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { standardRateLimit } from "@/utils/ratelimit";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

async function bookmarkReport(reportId: string | mongoose.Types.ObjectId) {
	console.log("bookmarkReport called with reportId:", reportId);

	try {
		await connectDB();

		const { userId: clerkUserId } = auth();
		console.log("clerkUserId:", clerkUserId);

		if (!clerkUserId) {
			console.log("User ID is required");
			return { error: "User ID is required" };
		}

		const { success } = await standardRateLimit.limit(clerkUserId);
		if (!success) {
			console.log("Rate limit exceeded");
			return { error: "Too many requests. Please try again later." };
		}

		// Find user in database
		const user = await User.findOne({ clerkId: clerkUserId });
		console.log("User found:", user ? "Yes" : "No");

		if (!user) {
			console.log("User not found");
			return { error: "User not found" };
		}

		// Check if report is bookmarked
		let isBookmarked = user.bookmarks.includes(reportId);
		console.log("Is report already bookmarked:", isBookmarked);

		let message;

		if (isBookmarked) {
			// If already bookmarked, remove it
			user.bookmarks.pull(reportId);
			message = "Bookmark removed successfully";
			isBookmarked = false;
		} else {
			// If not bookmarked, add it
			user.bookmarks.push(reportId);
			message = "Bookmark added successfully";
			isBookmarked = true;
		}

		await user.save();
		console.log("User saved successfully");

		// Revalidate the cache
		revalidatePath("/reports/bookmarks", "page");

		console.log("Returning message:", message);
		return { message, isBookmarked };
	} catch (error) {
		console.error("Error in bookmarkReport:", error);
		return { error: "An error occurred while updating the bookmark" };
	}
}

export default bookmarkReport;
