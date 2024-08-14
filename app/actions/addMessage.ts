"use server";

import connectDB from "@/config/database";
import Message from "@/models/Message";
import User from "@/models/User";
import { standardRateLimit } from "@/utils/ratelimit";
import { sanitizeText } from "@/utils/sanitizeHtml";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

type FormState = {
	error: string;
	submitted?: boolean;
};

async function addMessage(
	state: FormState,
	formData: FormData
): Promise<FormState> {
	await connectDB();

	const { userId: clerkUserId } = auth();

	if (!clerkUserId) {
		return { error: "You must be logged in to send a message" };
	}

	const { success } = await standardRateLimit.limit(clerkUserId);

	if (!success) {
		return { error: "Too many messages. Please try again later." };
	}

	// Find the sender (current user) in the database
	const sender = await User.findOne({ clerkId: clerkUserId });
	if (!sender) {
		return { error: "Sender not found in the database" };
	}

	const recipientId = formData.get("recipient");
	const recipient = await User.findById(recipientId);
	if (!recipient) {
		return { error: "Recipient does not exist" };
	}

	if (sender._id.toString() === recipient._id.toString()) {
		return { error: "You can not send a message to yourself" };
	}

	const newMessage = new Message({
		sender: sender._id,
		recipient: recipient._id,
		name: sanitizeText(formData.get("name") as string),
		email: sanitizeText(formData.get("email") as string),
		body: sanitizeText(formData.get("message") as string),
	});

	await newMessage.save();

	// Revalidate cache
	revalidatePath("/messages", "page");

	return { submitted: true, error: "" };
}

export default addMessage;
