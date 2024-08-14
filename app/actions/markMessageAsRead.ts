"use server";

import connectDB from "@/config/database";
import Message from "@/models/Message";
import User from "@/models/User";
import { standardRateLimit } from "@/utils/ratelimit";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

async function markMessageAsRead(messageId: string) {
	await connectDB();

	const { userId: clerkUserId } = auth();

	if (!clerkUserId) {
		throw new Error("User ID is required");
	}

	const { success } = await standardRateLimit.limit(clerkUserId);
	if (!success) {
		throw new Error("Too many requests. Please try again later.");
	}

	// Find the MongoDB user document using the Clerk user ID
	const user = await User.findOne({ clerkId: clerkUserId });
	if (!user) {
		throw new Error("User not found");
	}

	const message = await Message.findById(messageId);

	if (!message) throw new Error("Message not found");

	// Verify ownership using MongoDB user ID
	if (message.recipient.toString() !== user._id.toString()) {
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
