"use server";

import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { ratelimit } from "@/utils/ratelimit";

async function deleteMessage(messageId: string) {
	await connectDB();

	const sessionUser = await getSessionUser();

	if (!sessionUser || !sessionUser.user) {
		throw new Error("User ID is required");
	}

	const { success } = await ratelimit.limit(sessionUser.userId);
	if (!success) {
		throw new Error("Too many delete requests. Please try again later.");
	}

	const { userId } = sessionUser;

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
