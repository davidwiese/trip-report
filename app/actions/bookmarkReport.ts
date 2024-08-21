"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { standardRateLimit } from "@/utils/ratelimit";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

async function bookmarkReport(reportId: string | mongoose.Types.ObjectId) {
	try {
		await connectDB();

		const { userId: clerkUserId } = auth();

		if (!clerkUserId) {
			return { error: "User ID is required" };
		}

		const { success } = await standardRateLimit.limit(clerkUserId);
		if (!success) {
			return { error: "Too many requests. Please try again later." };
		}

		// Find user in database
		const user = await User.findOne({ clerkId: clerkUserId });

		if (!user) {
			return { error: "User not found" };
		}

		// Check if report is bookmarked
		let isBookmarked = user.bookmarks.includes(reportId);

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

		// Revalidate the cache
		revalidatePath("/reports/bookmarks", "page");

		return { message, isBookmarked };
	} catch (error) {
		console.error("Error in bookmarkReport:", error);
		return { error: "An error occurred while updating the bookmark" };
	}
}

export default bookmarkReport;
