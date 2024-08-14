"use server";

import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Report from "@/models/Report";
import User from "@/models/User";
import { reportRateLimit } from "@/utils/ratelimit";
import {
	sanitizeDescription,
	sanitizeHtmlContent,
	sanitizeText,
} from "@/utils/sanitizeHtml";
import { findUserByClerkId } from "@/utils/userUtils";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

async function updateReport(reportId: string, formData: FormData) {
	let updatedReport;

	try {
		await connectDB();

		const { userId: clerkUserId } = auth();

		if (!clerkUserId) {
			throw new Error("User ID is required");
		}

		const { success } = await reportRateLimit.limit(clerkUserId);

		if (!success) {
			throw new Error("Too many update requests. Please try again later.");
		}

		const user = await findUserByClerkId(clerkUserId);
		if (!user) {
			throw new Error("User not found");
		}

		const existingReport = await Report.findById(reportId);

		if (!existingReport) {
			throw new Error("Report not found");
		}

		// Verify ownership
		if (existingReport.owner.toString() !== user._id.toString()) {
			throw new Error("Current user does not own this report");
		}

		// Validation for required fields
		const requiredFields = [
			"title",
			"activityType",
			"description",
			"location.country",
			"location.region",
			"location.localArea",
			"location.objective",
			"distance",
			"elevationGain",
			"elevationLoss",
			"duration",
			"body",
			"startDate",
			"endDate",
		];

		for (const field of requiredFields) {
			if (field === "activityType") {
				if (formData.getAll(field).length === 0) {
					throw new Error("At least one activity type is required");
				}
			} else if (field === "body") {
				const bodyValue = formData.get(field);
				if (typeof bodyValue === "string" && bodyValue.trim() === "") {
					throw new Error("Trip report body cannot be empty");
				}
			} else if (!formData.get(field)) {
				throw new Error(`${field.replace(".", " ")} is required`);
			}
		}

		// Validation for numeric fields
		const numericFields = [
			"distance",
			"elevationGain",
			"elevationLoss",
			"duration",
		];
		for (const field of numericFields) {
			const value = formData.get(field);
			if (value && isNaN(Number(value))) {
				throw new Error(`${field} must be a number`);
			}
		}

		// Validation for date range
		const startDate = new Date(formData.get("startDate") as string);
		const endDate = new Date(formData.get("endDate") as string);

		if (endDate < startDate) {
			throw new Error(
				"End date must be equal to or later than the start date."
			);
		}

		// Handle removed images
		const imagesToRemove = formData.getAll("imagesToRemove").map(String);
		for (const imageUrl of imagesToRemove) {
			const fileName = imageUrl.split("/").pop()?.split(".")[0];
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

		// Handle new images
		const newImages = JSON.parse(formData.get("imageUrls") as string);
		const files = formData
			.getAll("images")
			.filter((file: any) => file instanceof File && file.size > 0); // Filter out empty files
		const existingImageCount = existingReport.images?.length ?? 0; // Use optional chaining or provide a default value
		const markedForRemovalCount = imagesToRemove.length;
		const newImageCount = files.length;
		const totalImages =
			existingImageCount - markedForRemovalCount + newImageCount;

		if (totalImages > 5) {
			throw new Error("You can have a maximum of 5 images in total.");
		}

		// Merge new images with existing images and filter out any images marked for removal
		const finalImages = [
			...(existingReport.images || []).filter(
				(image: { url: string }) => !imagesToRemove.includes(image.url)
			),
			...newImages,
		];

		// Update the GPX file
		let gpxFileUrl:
			| { url: string; originalFilename: string }
			| undefined
			| null = existingReport.gpxFile;
		const gpxFile = formData.get("gpxFile");
		const removeGpxFile = formData.get("removeGpxFile");

		if (removeGpxFile === "true") {
			if (existingReport.gpxFile) {
				const publicId = existingReport.gpxFile.url.split("/").pop();
				if (publicId) {
					try {
						const result = await cloudinary.uploader.destroy(
							`trip-report/gpx/${publicId}`,
							{
								resource_type: "raw",
							}
						);
						if (result.result !== "ok") {
							throw new Error(`Failed to remove GPX file: ${result.result}`);
						}
					} catch (error) {
						console.error("Error removing GPX file from Cloudinary:", error);
						throw new Error("Failed to remove GPX file from Cloudinary");
					}
				}
			}
			gpxFileUrl = null; // Set the URL to null if the file is removed
		} else if (gpxFile instanceof File && gpxFile.size > 0) {
			if (existingReport.gpxFile) {
				const publicId = existingReport.gpxFile.url.split("/").pop();
				if (publicId) {
					try {
						const result = await cloudinary.uploader.destroy(
							`trip-report/gpx/${publicId}`,
							{
								resource_type: "raw",
							}
						);
						if (result.result !== "ok") {
							throw new Error(
								`Failed to remove old GPX file: ${result.result}`
							);
						}
					} catch (error) {
						console.error(
							"Error removing old GPX file from Cloudinary:",
							error
						);
						throw new Error("Failed to remove old GPX file from Cloudinary");
					}
				}
			}

			const fileBuffer = await gpxFile.arrayBuffer();
			const base64 = Buffer.from(fileBuffer).toString("base64");
			const fileMime = gpxFile.type;
			const base64File = `data:${fileMime};base64,${base64}`;

			const result = await cloudinary.uploader.upload(base64File, {
				folder: "trip-report/gpx",
				resource_type: "raw",
				public_id: `${uuidv4()}`,
			});
			gpxFileUrl = {
				url: result.secure_url,
				originalFilename: gpxFile.name,
			};
		}

		// Handle Caltopo URL
		let caltopoUrl: string | null = sanitizeText(
			formData.get("caltopoUrl") as string
		);
		if (caltopoUrl === "e.g. https://caltopo.com/m/EH41" || caltopoUrl === "") {
			caltopoUrl = null; // Set Caltopo URL to null if it's the placeholder or empty
		}

		// Create reportData object for database
		const reportData: {
			title: FormDataEntryValue | null;
			activityType: string[];
			description: FormDataEntryValue | null;
			body: FormDataEntryValue | null;
			location: {
				country: FormDataEntryValue | null;
				region: FormDataEntryValue | null;
				localArea: FormDataEntryValue | null;
				objective: FormDataEntryValue | null;
			};
			distance: FormDataEntryValue | null;
			elevationGain: FormDataEntryValue | null;
			elevationLoss: FormDataEntryValue | null;
			duration: FormDataEntryValue | null;
			startDate: FormDataEntryValue | null;
			endDate: FormDataEntryValue | null;
			caltopoUrl?: FormDataEntryValue | null;
			gpxFile?: { url: string; originalFilename: string } | undefined | null;
			images?: { url: string; originalFilename: string }[];
		} = {
			title: sanitizeText(formData.get("title") as string | null),
			activityType: formData
				.getAll("activityType")
				.map((type) => sanitizeText(type as string)) as string[],
			description: sanitizeDescription(formData.get("description") as string),
			body: sanitizeHtmlContent(formData.get("body") as string),
			location: {
				country: sanitizeText(
					formData.get("location.country") as string | null
				),
				region: sanitizeText(formData.get("location.region") as string | null),
				localArea: sanitizeText(
					formData.get("location.localArea") as string | null
				),
				objective: sanitizeText(
					formData.get("location.objective") as string | null
				),
			},
			distance: sanitizeText(formData.get("distance") as string | null),
			elevationGain: sanitizeText(
				formData.get("elevationGain") as string | null
			),
			elevationLoss: sanitizeText(
				formData.get("elevationLoss") as string | null
			),
			duration: sanitizeText(formData.get("duration") as string | null),
			startDate: sanitizeText(formData.get("startDate") as string | null),
			endDate: sanitizeText(formData.get("endDate") as string | null),
			caltopoUrl: caltopoUrl, // Conditionally add the Caltopo URL
			gpxFile: gpxFileUrl, // Conditionally add the gpxFile URL
			images: finalImages, // Conditionally add the images array
		};

		if (gpxFileUrl === null || caltopoUrl === null) {
			// Create an object to unset fields
			const unsetFields: any = {};
			if (gpxFileUrl === null) {
				unsetFields.gpxFile = 1;
				reportData.gpxFile = undefined;
			}
			if (caltopoUrl === null) {
				unsetFields.caltopoUrl = 1;
				reportData.caltopoUrl = undefined;
			}
			await Report.updateOne({ _id: reportId }, { $unset: unsetFields });
		}
		if (reportData.images && reportData.images.length === 0) {
			reportData.images = undefined;
			// If images is an empty array, unset the images field
			await Report.updateOne({ _id: reportId }, { $unset: { images: 1 } });
		}
		updatedReport = await Report.findByIdAndUpdate(reportId, reportData, {
			new: true,
		});

		// Update user's totalDistance, totalElevationGain, and totalElevationLoss
		const distanceDifference =
			Number(updatedReport.distance) - Number(existingReport.distance);
		const elevationGainDifference =
			Number(updatedReport.elevationGain) -
			Number(existingReport.elevationGain);
		const elevationLossDifference =
			Number(updatedReport.elevationLoss) -
			Number(existingReport.elevationLoss);

		await User.findByIdAndUpdate(
			user._id,
			{
				$inc: {
					totalDistance: distanceDifference,
					totalElevationGain: elevationGainDifference,
					totalElevationLoss: elevationLossDifference,
				},
			},
			{ new: true }
		);
	} catch (error) {
		console.error("Error updating report:", error);
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error(
				"An error occurred while updating the report. Please try again."
			);
		}
	}

	// Revalidate the cache
	revalidatePath(`/reports/${reportId}`);
	revalidatePath(`/reports/${reportId}/edit`, "layout");
	revalidatePath("/", "layout");

	redirect(`/reports/${updatedReport._id}`);
}

export default updateReport;
