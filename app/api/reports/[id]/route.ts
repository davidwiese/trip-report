import { NextRequest } from "next/server";
import connectDB from "@/config/database";
import Report from "@/models/Report";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";

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

		// extract public id's from image url in DB
		const publicIds = report.images.map((imageUrl: string) => {
			const parts = imageUrl.split("/");
			const lastPart = parts.at(-1);
			return lastPart ? lastPart.split(".").at(0) : undefined;
		});

		// Filter out any undefined publicIds
		const validPublicIds = publicIds.filter(
			(publicId: string): publicId is string => publicId !== undefined
		);

		// Delete images from Cloudinary
		if (validPublicIds.length > 0) {
			for (let publicId of validPublicIds) {
				await cloudinary.uploader.destroy("trip-report/" + publicId);
			}
		}

		await report.deleteOne();

		return new Response("Report deleted", { status: 200 });
	} catch (error) {
		return new Response("Something went wrong", { status: 500 });
	}
};
