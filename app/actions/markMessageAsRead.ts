"use server";

import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

async function markMessageAsRead(messageId: string) {
	await connectDB();
	const sessionUser = await getSessionUser();
	if (!sessionUser || !sessionUser.user) {
		throw new Error("User ID is required");
	}
	const { userId } = sessionUser;

	const message = await Message.findById(messageId);

	if (!message) throw new Error("Message not found");

	// Verify ownership
	if (message.recipient.toString() !== userId) {
		return new Response("Unauthorized", { status: 401 });
	}

	// Update message to read/unread depending on the current status
	message.read = !message.read;

	await message.save();
	return message.read;
}

export default markMessageAsRead;
