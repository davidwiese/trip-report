"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { readRateLimit } from "@/utils/ratelimit";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";

async function checkBookmarkStatus(reportId: string | mongoose.Types.ObjectId) {
	await connectDB();

	const { userId: clerkUserId } = auth();

	if (!clerkUserId) {
		return { error: "User ID is required" };
	}

	const { success } = await readRateLimit.limit(clerkUserId);
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

	return { isBookmarked };
}

export default checkBookmarkStatus;
