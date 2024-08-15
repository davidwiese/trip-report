"use server";

import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Report from "@/models/Report";
import User from "@/models/User";
import { reportRateLimit } from "@/utils/ratelimit";
import { findUserByClerkId } from "@/utils/userUtils";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

async function deleteReport(reportId: string | mongoose.Types.ObjectId) {
	const { userId: clerkUserId } = auth();

	// Check for session
	if (!clerkUserId) {
		throw new Error("User ID is required");
	}

	const { success } = await reportRateLimit.limit(clerkUserId);
	if (!success) {
		throw new Error("Too many requests. Please try again later.");
	}

	await connectDB();

	const user = await findUserByClerkId(clerkUserId);
	if (!user) {
		throw new Error("User not found");
	}

	const report = await Report.findById(reportId);

	if (!report) throw new Error("Report Not Found");

	// Verify ownership
	if (report.owner.toString() !== user._id.toString()) {
		throw new Error("Unauthorized");
	}

	// Helper function to extract public ID from Cloudinary URL
	const getPublicIdFromUrl = (url: string): string | null => {
		const match = url.match(/\/v\d+\/(.+?)\./);
		return match ? match[1] : null;
	};

	// Delete images from Cloudinary
	if (report.images && report.images.length > 0) {
		for (const image of report.images) {
			const publicId = getPublicIdFromUrl(image.url);
			if (publicId) {
				try {
					const result = await cloudinary.uploader.destroy(
						`trip-report/${publicId}`
					);
					if (result.result !== "ok") {
						console.error(
							`Failed to delete image: ${publicId}. Cloudinary response:`,
							result
						);
					}
				} catch (error) {
					console.error(
						`Error deleting image with public ID ${publicId}:`,
						error
					);
				}
			} else {
				console.error(`Could not extract public ID from URL: ${image.url}`);
			}
		}
	}

	// Delete GPX file from Cloudinary (if any)
	if (report.gpxFile) {
		const gpxPublicId = getPublicIdFromUrl(report.gpxFile.url);
		if (gpxPublicId) {
			try {
				const result = await cloudinary.uploader.destroy(
					`trip-report/gpx/${gpxPublicId}`,
					{
						resource_type: "raw",
					}
				);
				if (result.result !== "ok") {
					console.error(
						`Failed to delete GPX file: ${gpxPublicId}. Cloudinary response:`,
						result
					);
				}
			} catch (error) {
				console.error(
					`Error deleting GPX file with public ID ${gpxPublicId}:`,
					error
				);
			}
		} else {
			console.error(
				`Could not extract public ID from GPX file URL: ${report.gpxFile.url}`
			);
		}
	}

	// Proceed with report deletion
	try {
		await report.deleteOne();

		// Update the user's reports array and totalReports count
		await User.findByIdAndUpdate(user._id, {
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
