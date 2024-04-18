"use server";

const { default: connectDB } = require("@/config/database");
const { default: User } = require("@/models/User");
const { getSessionUser } = require("@/utils/getSessionUser");
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
