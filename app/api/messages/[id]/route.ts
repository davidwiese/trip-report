import connectDB from "@/config/database";
import { NextRequest } from "next/server";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

// PUT /api/message/:id
export const PUT = async (
	request: NextRequest,
	{ params }: { params: { id: string } }
) => {
	try {
		await connectDB();

		const { id } = params;

		const sessionUser = await getSessionUser();

		if (!sessionUser || !sessionUser.user) {
			return new Response("User ID is required", {
				status: 401,
			});
		}

		const { userId } = sessionUser;

		const message = await Message.findById(id);

		if (!message) return new Response("Message not found", { status: 404 });

		// Verify ownership
		if (message.recipient.toString() !== userId) {
			return new Response("Unauthorized", { status: 401 });
		}

		// Update message to read/unread
		message.read = !message.read;

		await message.save();

		return new Response(JSON.stringify(message), { status: 200 });
	} catch (error) {
		console.log(error);
		return new Response("Something went wrong", { status: 500 });
	}
};

// DELETE /api/message/:id
export const DELETE = async (
	request: NextRequest,
	{ params }: { params: { id: string } }
) => {
	try {
		await connectDB();

		const { id } = params;

		const sessionUser = await getSessionUser();

		if (!sessionUser || !sessionUser.user) {
			return new Response("User ID is required", {
				status: 401,
			});
		}

		const { userId } = sessionUser;

		const message = await Message.findById(id);

		if (!message) return new Response("Message not found", { status: 404 });

		// Verify ownership
		if (message.recipient.toString() !== userId) {
			return new Response("Unauthorized", { status: 401 });
		}

		await message.deleteOne();

		return new Response("Message Deleted", { status: 200 });
	} catch (error) {
		console.log(error);
		return new Response("Something went wrong", { status: 500 });
	}
};
