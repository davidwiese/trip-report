import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

type SessionUser = {
	id: string;
};

// NOTE: the GET function is no longer used as we can server render the Messages

// POST /api/messages
export const POST = async (request: NextRequest) => {
	try {
		await connectDB();

		const { name, email, phone, message, report, recipient } =
			await request.json();

		const sessionUser = await getSessionUser();

		if (!sessionUser || !sessionUser.user) {
			return Response.json(
				{
					message: "You must be logged in to send a message",
				},
				{ status: 401 }
			);
		}

		const { user } = sessionUser;

		// Can not send message to self
		if ((user as SessionUser).id === recipient) {
			return Response.json(
				{
					message: "Can not send a message to yourself",
				},
				{ status: 400 }
			);
		}

		const newMessage = new Message({
			sender: (user as SessionUser).id,
			recipient,
			name,
			email,
			phone,
			body: message,
			report,
		});

		await newMessage.save();

		return Response.json({ message: "Message Sent" });
	} catch (error) {
		console.log(error);
		return new Response("Something went wrong", { status: 500 });
	}
};
