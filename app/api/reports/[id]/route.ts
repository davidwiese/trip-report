import { NextRequest } from "next/server";
import connectDB from "@/config/database";
import Report from "@/models/Report";
import { getSessionUser } from "@/utils/getSessionUser";

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

// DELETE /api/reports/:id
export const DELETE = async (
	request: NextRequest,
	{ params }: { params: { [key: string]: string } }
) => {
	try {
		const reportId = params.id;

		const sessionUser = await getSessionUser();

		// Check for session
		if (!sessionUser || !sessionUser.userId) {
			return new Response("User ID is required", { status: 401 });
		}

		const { userId } = sessionUser;

		await connectDB();

		const report = await Report.findById(reportId);

		if (!report) return new Response("Report not found", { status: 404 });

		// Verify ownership
		if (report.owner.toString() !== userId) {
			return new Response("Unauthorized", { status: 401 });
		}

		await report.deleteOne();

		return new Response("Property deleted", { status: 200 });
	} catch (error) {
		return new Response("Something went wrong", { status: 500 });
	}
};
