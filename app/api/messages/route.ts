import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

type SessionUser = {
	id: string;
};

// GET /api/messages
export const GET = async () => {
	try {
		await connectDB();

		const sessionUser = await getSessionUser();

		if (!sessionUser || !sessionUser.user) {
			return new Response(JSON.stringify("User ID is required"), {
				status: 401,
			});
		}

		const { userId } = sessionUser;

		const readMessages = await Message.find({ recipient: userId, read: true })
			.sort({ createdAt: -1 }) // Sort read messages in ascending order
			.populate("sender", "username")
			.populate("report", "name");

		const unreadMessages = await Message.find({
			recipient: userId,
			read: false,
		})
			.sort({ createdAt: -1 }) // Sort unread messages in ascending order
			.populate("sender", "username")
			.populate("report", "name");

		const messages = [...unreadMessages, ...readMessages];

		return Response.json(messages);
	} catch (error) {
		console.log(error);
		return new Response("Something went wrong", { status: 500 });
	}
};

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
