import connectDB from "@/config/database";
import { NextRequest } from "next/server"
import User from "@/models/User";
import Report from "@/models/Report";
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

		let message;

		if (isBookmarked) {
			// If already bookmarked, remove it
			user.bookmarks.pull(reportId);
			message = "Bookmark removed successfully";
			isBookmarked = false;
		} else {
			// If not bookmarked, add it
			user.bookmarks.push(reportId);
			message = "Bookmark added successfully";
			isBookmarked = true;
		}

		await user.save();

		return new Response(JSON.stringify({ message, isBookmarked }), {
			status: 200,
		});
	} catch (error) {
		console.log(error);
		return new Response("Something went wrong", { status: 500 });
	}
};