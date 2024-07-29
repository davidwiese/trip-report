"use server";

import connectDB from "@/config/database";
import Message from "@/models/Message";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { readRateLimit } from "@/utils/ratelimit";

async function getUnreadMessageCount() {
	await connectDB();

	const { userId } = auth();

	if (!userId) {
		return { error: "User ID is required" };
	}

	const { success } = await readRateLimit.limit(userId);
	if (!success) {
		return { error: "Too many requests. Please try again later." };
	}

	// Find the MongoDB user document using the Clerk ID
	const user = await User.findOne({ clerkId: userId });

	if (!user) {
		return { error: "User not found in database" };
	}

	const count = await Message.countDocuments({
		recipient: user._id,
		read: false,
	});

	return { count };
}

export default getUnreadMessageCount;
