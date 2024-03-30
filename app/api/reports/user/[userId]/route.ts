import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/config/database";
import Report from "@/models/Report";

// GET /api/reports/user/:userId
export const GET = async (
	request: NextRequest,
	{ params }: { params: { userId: string } }
) => {
	try {
		await connectDB();

		const userId = params.userId;

		if (!userId) {
			return new Response("User ID is required", { status: 400 });
		}

		const reports = await Report.find({ owner: userId });

		return Response.json(reports);
	} catch (error) {
		return new Response("Something went wrong", { status: 500 });
	}
};
