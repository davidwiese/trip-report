import connectDB from "@/config/database";
import { NextRequest } from "next/server";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

export const POST = async (request: NextRequest) => {
	try {
		await connectDB();

		const { reportId } = await request.json();

		const sessionUser = await getSessionUser();

		if (!sessionUser || !sessionUser.userId) {
			return new Response("User ID is required", { status: 401 });
		}

		const { userId } = sessionUser;

		//Find the user by their session ID
		const user = await User.findOne({ _id: userId });

		// Check if report is already bookmarked
		let isBookmarked = user.bookmarks.includes(reportId);

		return Response.json({ isBookmarked });
	} catch (error) {
		console.log(error);
		return new Response("Something went wrong", { status: 500 });
	}
};
