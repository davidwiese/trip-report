"use server";

import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { standardRateLimit } from "@/utils/ratelimit";

async function markMessageAsRead(messageId: string) {
	await connectDB();
	const sessionUser = await getSessionUser();
	if (!sessionUser || !sessionUser.user) {
		throw new Error("User ID is required");
	}

	const { success } = await standardRateLimit.limit(sessionUser.userId);
	if (!success) {
		throw new Error("Too many requests. Please try again later.");
	}

	const { userId } = sessionUser;

	const message = await Message.findById(messageId);

	if (!message) throw new Error("Message not found");

	// Verify ownership
	if (message.recipient.toString() !== userId) {
		throw new Error("Unauthorized");
	}

	// Update message to read/unread depending on the current status
	message.read = !message.read;

	// Revalidate cache
	revalidatePath("/messages", "page");
	await message.save();
	return message.read;
}

export default markMessageAsRead;
