"use server";

import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { readRateLimit } from "@/utils/ratelimit";

async function getUnreadMessageCount() {
	await connectDB();

	const sessionUser = await getSessionUser();

	if (!sessionUser || !sessionUser.user) {
		return { error: "User ID is required" };
	}

	const { success } = await readRateLimit.limit(sessionUser.userId);
	if (!success) {
		return { error: "Too many requests. Please try again later." };
	}

	const { userId } = sessionUser;

	const count = await Message.countDocuments({
		recipient: userId,
		read: false,
	});

	return { count };
}

export default getUnreadMessageCount;
