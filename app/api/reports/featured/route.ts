import { NextRequest } from "next/server";

import connectDB from "@/config/database";
import Report from "@/models/Report";

// GET /api/reports
export const GET = async (request: NextRequest) => {
	try {
		await connectDB();

		const reports = await Report.find({
			is_featured: true,
		});

		return Response.json(reports);
	} catch (error) {
		return new Response("Something went wrong", { status: 500 });
	}
};
