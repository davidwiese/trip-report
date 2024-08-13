"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { standardRateLimit } from "@/utils/ratelimit";

async function bookmarkReport(reportId: string | mongoose.Types.ObjectId) {
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
	const user = await User.findById({ clerkId: clerkUserId });

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
}

export default bookmarkReport;
