"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
import mongoose from "mongoose";

async function checkBookmarkStatus(reportId: string | mongoose.Types.ObjectId) {
	await connectDB();

	const sessionUser = await getSessionUser();

	if (!sessionUser || !sessionUser.userId) {
		return { error: "User ID is required" };
	}

	const { userId } = sessionUser;

	// Find user in database
	const user = await User.findById(userId);

	// Check if report is bookmarked
	let isBookmarked = user.bookmarks.includes(reportId);

	return { isBookmarked };
}

export default checkBookmarkStatus;
