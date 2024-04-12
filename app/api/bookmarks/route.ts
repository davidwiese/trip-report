import connectDB from "@/config/database";
import { NextRequest } from "next/server";
import User from "@/models/User";
import Report from "@/models/Report";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

// GET /api/bookmarks
export const GET = async (request: NextRequest) => {
	try {
		await connectDB();

		const sessionUser = await getSessionUser();

		if (!sessionUser || !sessionUser.userId) {
			return new Response("User ID is required", { status: 401 });
		}

		const { userId } = sessionUser;

		// Find the user by their session ID
		const user = await User.findOne({ _id: userId });

		// Get user's bookmarks
		const bookmarks = await Report.find({ _id: { $in: user.bookmarks } });

		return Response.json(bookmarks);
	} catch (error) {
		console.log(error);
		return new Response("Something went wrong", { status: 500 });
	}
};

// POST /api/bookmarks
export const POST = async (request: NextRequest) => {
	try {
		await connectDB();

		const { reportId } = await request.json();

		const sessionUser = await getSessionUser();

		if (!sessionUser || !sessionUser.userId) {
			return new Response("User ID is required", { status: 401 });
		}

		const { userId } = sessionUser;

		// Find the user by their session ID
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

		return Response.json({ message, isBookmarked });
	} catch (error) {
		console.log(error);
		return new Response("Something went wrong", { status: 500 });
	}
};
