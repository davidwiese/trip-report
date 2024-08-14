"use server";

import connectDB from "@/config/database";
import Message from "@/models/Message";
import { standardRateLimit } from "@/utils/ratelimit";
import { findUserByClerkId } from "@/utils/userUtils";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

async function deleteMessage(messageId: string) {
	await connectDB();

	const { userId: clerkUserId } = auth();

	if (!clerkUserId) {
		throw new Error("User ID is required");
	}

	const { success } = await standardRateLimit.limit(clerkUserId);
	if (!success) {
		throw new Error("Too many delete requests. Please try again later.");
	}

	const user = await findUserByClerkId(clerkUserId);
	if (!user) {
		throw new Error("User not found");
	}

	const message = await Message.findById(messageId);

	if (!message) throw new Error("Message Not Found");

	// Verify ownership
	if (message.recipient.toString() !== user._id.toString()) {
		throw new Error("Unauthorized");
	}

	// Revalidate cache
	revalidatePath("/messages", "page");
	await message.deleteOne();
}

export default deleteMessage;
