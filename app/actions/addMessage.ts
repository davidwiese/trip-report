"use server";

import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

type FormState = {
	error: string;
	submitted?: boolean;
};

// NOTE: here we have previousState as a first argument as in our
// ReportContactForm we are using the useFormState hook from React DOM to give
// the user some information about the state of the form submission.
// https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#server-side-validation-and-error-handling

async function addMessage(
	state: FormState,
	formData: FormData
): Promise<FormState> {
	await connectDB();

	const sessionUser = await getSessionUser();

	// NOTE: Here we send an { error } object back which we can use to then show
	// the user a toast message.
	// We don't want to throw here like we did in our report server actions as that would
	// then be 'caught' by our error.jsx ErrorBoundary component and show the user
	// our Error page.

	if (!sessionUser || !sessionUser.user) {
		return { error: "You must be logged in to send a message" };
	}

	const { userId } = sessionUser;

	const recipient = formData.get("recipient");

	if (userId === recipient) {
		return { error: "You can not send a message to yourself" };
	}

	const newMessage = new Message({
		sender: userId,
		recipient,
		subject: formData.get("subject"),
		body: formData.get("message"),
	});

	await newMessage.save();

	// Revalidate cache
	revalidatePath("/messages", "page");

	return { submitted: true, error: "" };
}

export default addMessage;
