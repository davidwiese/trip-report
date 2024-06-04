"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { ratelimit } from "@/utils/ratelimit";

async function bookmarkReport(reportId: string | mongoose.Types.ObjectId) {
	await connectDB();

	const sessionUser = await getSessionUser();

	if (!sessionUser || !sessionUser.userId) {
		return { error: "User ID is required" };
	}

	const { success } = await ratelimit.limit(sessionUser.userId);
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
	revalidatePath("/reports/saved", "page");
	// NOTE: A nice demonstration of NextJS caching can be done here by first
	// commenting out the above line, then bookmark or un-bookmark a report for
	// a user then visit /properties/saved (either via link or going back in the
	// browser) and you will see the old results until
	// you refresh the page. If you then add back in the above line and repeat,
	// you will see the users saved properties are up to date.

	return { message, isBookmarked };
}

export default bookmarkReport;
