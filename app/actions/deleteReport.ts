"use server";

import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Report from "@/models/Report";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

async function deleteReport(reportId: string | mongoose.Types.ObjectId) {
	const sessionUser = await getSessionUser();

	// Check for session
	if (!sessionUser || !sessionUser.userId) {
		throw new Error("User ID is required");
	}

	const { userId } = sessionUser;

	await connectDB();

	const report = await Report.findById(reportId);

	if (!report) throw new Error("Report Not Found");

	// Verify ownership
	if (report.owner.toString() !== userId) {
		throw new Error("Unauthorized");
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

	// Proceed with property deletion
	await report.deleteOne();

	// Revalidate the cache
	// NOTE: since properties are pretty much on every page, we can simply
	// revalidate everything that uses our top level layout
	revalidatePath("/", "layout");
}

export default deleteReport;
