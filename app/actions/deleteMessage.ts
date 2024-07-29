"use server";

import connectDB from "@/config/database";
import Message from "@/models/Message";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { standardRateLimit } from "@/utils/ratelimit";

async function deleteMessage(messageId: string) {
	await connectDB();

	const { userId } = auth();

	if (!userId) {
		throw new Error("User ID is required");
	}

	const { success } = await standardRateLimit.limit(userId);
	if (!success) {
		throw new Error("Too many delete requests. Please try again later.");
	}

	const message = await Message.findById(messageId);

	if (!message) throw new Error("Message Not Found");

	// Verify ownership
	if (message.recipient.toString() !== userId) {
		throw new Error("Unauthorized");
	}

	// Revalidate cache
	revalidatePath("/messages", "page");
	await message.deleteOne();
}

export default deleteMessage;
