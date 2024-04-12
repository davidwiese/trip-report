import connectDB from "@/config/database";
import { NextRequest } from "next/server";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

// GET /api/messages/unread-count
export const GET = async (request: NextRequest) => {
	try {
		await connectDB();

		const sessionUser = await getSessionUser();

		if (!sessionUser || !sessionUser.user) {
			return new Response("User ID is required", {
				status: 401,
			});
		}

		const { userId } = sessionUser;

		const count = await Message.countDocuments({
			recipient: userId,
			read: false,
		});

		return Response.json(count);
	} catch (error) {
		console.log(error);
		return new Response("Something went wrong", { status: 500 });
	}
};