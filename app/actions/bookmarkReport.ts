"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { standardRateLimit } from "@/utils/ratelimit";

async function bookmarkReport(reportId: string | mongoose.Types.ObjectId) {
	await connectDB();

	const sessionUser = await getSessionUser();

	if (!sessionUser || !sessionUser.userId) {
		return { error: "User ID is required" };
	}

	const { success } = await standardRateLimit.limit(sessionUser.userId);
	if (!success) {
		return { error: "Too many requests. Please try again later." };
	}

	const { userId } = sessionUser;

	// Find user in database
	const user = await User.findById(userId);

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
