"use server";

import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Report from "@/models/Report";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { reportRateLimit } from "@/utils/ratelimit";

async function deleteReport(reportId: string | mongoose.Types.ObjectId) {
	const { userId } = auth();

	// Check for session
	if (!userId) {
		throw new Error("User ID is required");
	}

	const { success } = await reportRateLimit.limit(userId);
	if (!success) {
		throw new Error("Too many requests. Please try again later.");
	}

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
					await cloudinary.uploader.destroy(`trip-report/${fileName}`);
				} catch (error) {
					console.error(
						`Error deleting image with file name ${fileName}:`,
						error
					);
				}
			}
		}
	}

	// Delete GPX file from Cloudinary (if any)
	if (report.gpxFile) {
		const publicId = report.gpxFile.url.split("/").pop();
		if (publicId) {
			try {
				await cloudinary.uploader.destroy(`trip-report/gpx/${publicId}`, {
					resource_type: "raw",
				});
			} catch (error) {
				console.error(
					`Error deleting GPX file with public ID ${publicId}:`,
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
			$pull: { reports: reportId, bookmarks: reportId },
			$inc: {
				totalReports: -1,
				totalDistance: -report.distance,
				totalElevationGain: -report.elevationGain,
				totalElevationLoss: -report.elevationLoss,
			},
		});
	} catch (error) {
		console.error("Error deleting report:", error);
		throw new Error(
			"An error occurred while deleting the report. Please try again."
		);
	}

	revalidatePath("/", "layout");
}

export default deleteReport;
