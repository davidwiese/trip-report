"use server";

import connectDB from "@/config/database";
import Message from "@/models/Message";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import User from "@/models/User";
import { sanitizeText } from "@/utils/sanitizeHtml";
import { standardRateLimit } from "@/utils/ratelimit";

type FormState = {
	error: string;
	submitted?: boolean;
};

async function addMessage(
	state: FormState,
	formData: FormData
): Promise<FormState> {
	await connectDB();

	const { userId } = auth();

	// NOTE: Here we return an { error } object back which we can use to then show
	// the user a toast message.
	// We don't want to throw here like we did in our report server actions as that would
	// then be 'caught' by our error.jsx ErrorBoundary component and show the user
	// our Error page.

	if (!userId) {
		return { error: "You must be logged in to send a message" };
	}

	const { success } = await standardRateLimit.limit(userId);

	if (!success) {
		return { error: "Too many messages. Please try again later." };
	}

	const recipientId = formData.get("recipient");
	const recipientExists = await User.findById(recipientId);
	if (!recipientExists) {
		return { error: "Recipient does not exist" };
	}

	const recipient = formData.get("recipient");

	if (userId === recipient) {
		return { error: "You can not send a message to yourself" };
	}

	const newMessage = new Message({
		sender: userId,
		recipient,
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
