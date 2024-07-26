"use server";

import connectDB from "@/config/database";
import Message from "@/models/Message";
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

	const count = await Message.countDocuments({
		recipient: userId,
		read: false,
	});

	return { count };
}

export default getUnreadMessageCount;
