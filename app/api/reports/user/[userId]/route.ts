import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/config/database";
import Report from "@/models/Report";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";

// GET /api/reports
export const GET = async (request: NextRequest) => {
	try {
		await connectDB();

		const reports = await Report.find({});

		return Response.json(reports);
	} catch (error) {
		return new Response("Something went wrong", { status: 500 });
	}
};
