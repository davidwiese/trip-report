"use server";

import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Report from "@/models/Report";
import User from "@/models/User";
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

	// Delete images from Cloudinary
	if (report.images && report.images.length > 0) {
		for (const image of report.images) {
			const fileName = image.url.split("/").pop()?.split(".")[0];
			if (fileName) {
				try {
					const result = await cloudinary.uploader.destroy(
						`trip-report/${fileName}`
					);
					console.log(`Deleted image: ${fileName}`, result);
				} catch (error) {
					console.error(
						`Error deleting image with file name ${fileName}:`,
						error
					);
				}
			}
		}
	}

	// Delete GPX/KML file from Cloudinary (if any)
	if (report.gpxKmlFile) {
		const publicId = report.gpxKmlFile.url.split("/").pop();
		if (publicId) {
			try {
				const result = await cloudinary.uploader.destroy(
					`trip-report/gpx/${publicId}`,
					{
						resource_type: "raw",
					}
				);
				console.log(`Deleted GPX/KML file: ${publicId}`, result);
			} catch (error) {
				console.error(
					`Error deleting GPX/KML file with public ID ${publicId}:`,
					error
				);
			}
		}
	}

	// Proceed with report deletion
	try {
		await report.deleteOne();

		// Update the user's reports array and totalReports count
		await User.findByIdAndUpdate(userId, {
			$pull: { reports: reportId },
			$inc: { totalReports: -1 },
		});
	} catch (error) {
		console.error("Error deleting report:", error);
		throw new Error(
			"An error occurred while deleting the report. Please try again."
		);
	}

	// Revalidate the cache
	// NOTE: since properties are pretty much on every page, we can simply
	// revalidate everything that uses our top level layout
	revalidatePath("/", "layout");
}

export default deleteReport;
