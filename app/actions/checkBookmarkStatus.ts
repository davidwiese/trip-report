"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { readRateLimit } from "@/utils/ratelimit";

async function checkBookmarkStatus(reportId: string | mongoose.Types.ObjectId) {
	await connectDB();

	const { userId } = auth();

	if (!userId) {
		return { error: "User ID is required" };
	}

	const { success } = await readRateLimit.limit(userId);
	if (!success) {
		return { error: "Too many requests. Please try again later." };
	}

	// Find user in database
	const user = await User.findById(userId);

	// Check if report is bookmarked
	let isBookmarked = user.bookmarks.includes(reportId);

	return { isBookmarked };
}

export default checkBookmarkStatus;
