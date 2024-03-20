import { NextRequest } from "next/server";
import connectDB from "@/config/database";
import Report from "@/models/Report";

// GET /api/reports/:id
export const GET = async (
	request: NextRequest,
	{ params }: { params: { [key: string]: string } }
) => {
	try {
		await connectDB();

		const report = await Report.findById(params.id);

		if (!report) return new Response("Report not found", { status: 404 });

		return Response.json(report);
	} catch (error) {
		return new Response("Something went wrong", { status: 500 });
	}
};
