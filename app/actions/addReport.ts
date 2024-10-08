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
import { auth } from "@clerk/nextjs/server";
import { JSDOM } from "jsdom";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

const isBodyEmpty = (html: string) => {
	const dom = new JSDOM(html);
	const text = dom.window.document.body.textContent || "";
	return !text.trim();
};

async function addReport(formData: FormData) {
	let reportId = null;
	let reportData: any = {};

	const cloudinaryFolder =
		process.env.NODE_ENV === "production"
			? process.env.CLOUDINARY_FOLDER
			: process.env.CLOUDINARY_FOLDER_DEV || process.env.CLOUDINARY_FOLDER;

	try {
		await connectDB();

		const { userId: clerkUserId } = auth();

		if (!clerkUserId) {
			throw new Error("User ID is required");
		}

		// Find the user in your database using the Clerk userId
		const user = await User.findOne({ clerkId: clerkUserId });

		if (!user) {
			throw new Error("User not found in the database");
		}

		const { success } = await reportRateLimit.limit(clerkUserId);

		if (!success) {
			throw new Error("Too many reports. Please try again later.");
		}

		type LocationType = {
			country: FormDataEntryValue;
			region: FormDataEntryValue;
			localArea: FormDataEntryValue;
			objective: FormDataEntryValue;
		};

		// Sanitize and collect reportData object for database
		const reportData: {
			owner: string;
			title: FormDataEntryValue | null;
			activityType: string[];
			description: FormDataEntryValue | null;
			body: FormDataEntryValue | null;
			location: LocationType;
			distance: FormDataEntryValue | null;
			elevationGain: FormDataEntryValue | null;
			elevationLoss: FormDataEntryValue | null;
			duration: FormDataEntryValue | null;
			startDate: FormDataEntryValue | null;
			endDate: FormDataEntryValue | null;
			images?: { url: string; originalFilename: string }[];
			gpxFile?: { url: string; originalFilename: string };
			caltopoUrl?: FormDataEntryValue | null;
			isFeatured: boolean;
		} = {
			owner: user._id,
			title: sanitizeText(formData.get("title") as string),
			activityType: formData
				.getAll("activityType")
				.map((type) => sanitizeText(type as string)) as string[],
			description: sanitizeDescription(formData.get("description") as string),
			body: sanitizeHtmlContent(formData.get("body") as string),
			location: {
				country: sanitizeText(formData.get("location.country") as string)!,
				region: sanitizeText(formData.get("location.region") as string)!,
				localArea: sanitizeText(formData.get("location.localArea") as string)!,
				objective: sanitizeText(formData.get("location.objective") as string)!,
			},
			distance: sanitizeText(formData.get("distance") as string),
			elevationGain: sanitizeText(formData.get("elevationGain") as string),
			elevationLoss: sanitizeText(formData.get("elevationLoss") as string),
			duration: sanitizeText(formData.get("duration") as string),
			startDate: sanitizeText(formData.get("startDate") as string),
			endDate: sanitizeText(formData.get("endDate") as string),
			isFeatured: false,
		};

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

		let requiredFieldsValid = true;
		for (const field of requiredFields) {
			if (field === "activityType") {
				if (!formData.getAll(field).length) {
					requiredFieldsValid = false;
					break;
				}
			} else if (field === "body") {
				const bodyValue = formData.get(field);
				if (typeof bodyValue === "string" && isBodyEmpty(bodyValue)) {
					throw new Error("Trip report body cannot be empty");
				}
			} else if (!formData.get(field)) {
				requiredFieldsValid = false;
				break;
			}
		}

		const numericFields = [
			"distance",
			"elevationGain",
			"elevationLoss",
			"duration",
		];
		let numericFieldsValid = true;
		numericFields.forEach((field) => {
			const value = formData.get(field);
			if (value && isNaN(Number(value))) {
				numericFieldsValid = false;
			}
		});

		const startDate = new Date(formData.get("startDate") as string);
		const endDate = new Date(formData.get("endDate") as string);

		if (endDate < startDate) {
			throw new Error(
				"End date must be equal to or later than the start date."
			);
		}

		// If validation passes, proceed with file uploads and saving the report
		if (requiredFieldsValid && numericFieldsValid) {
			// Handle GPX file upload to Cloudinary
			const gpxFile = formData.get("gpxFile") as File | null;
			let gpxFileUrl: { url: string; originalFilename: string } | undefined;

			if (gpxFile && gpxFile.size > 0) {
				const fileBuffer = await gpxFile.arrayBuffer();
				const base64 = Buffer.from(fileBuffer).toString("base64");
				const fileMime = gpxFile.type;
				const base64File = `data:${fileMime};base64,${base64}`;

				const fileExtension = gpxFile.name.substring(
					gpxFile.name.lastIndexOf(".") + 1
				);

				const result = await cloudinary.uploader.upload(base64File, {
					folder: `${cloudinaryFolder}/gpx`,
					resource_type: "raw",
					public_id: `${uuidv4()}.${fileExtension}`,
				});
				gpxFileUrl = {
					url: result.secure_url,
					originalFilename: gpxFile.name,
				};
			}

			// Conditionally add gpxFile if it has a value
			if (gpxFileUrl) {
				reportData.gpxFile = gpxFileUrl;
			}

			// Conditionally add caltopoUrl if it has a value
			const caltopoUrl = formData.get("caltopoUrl");
			if (caltopoUrl) {
				reportData.caltopoUrl = sanitizeText(caltopoUrl as string);
			}

			// Add image URLs and filenames to reportData
			const imageUrls = JSON.parse(formData.get("imageUrls") as string);
			if (imageUrls.length > 0) {
				const validImages = imageUrls.filter(
					(image: { url: string; originalFilename: string }) =>
						image.url && image.originalFilename
				);

				if (validImages.length > 0) {
					reportData.images = validImages;
				}
			}

			const newReport = new Report(reportData);
			await newReport.save();
			reportId = newReport._id;

			// Update the user's reports array and totals
			await User.findByIdAndUpdate(user._id, {
				$push: { reports: newReport._id },
				$inc: {
					totalReports: 1,
					totalDistance: parseFloat(reportData.distance as string),
					totalElevationGain: parseFloat(reportData.elevationGain as string),
					totalElevationLoss: parseFloat(reportData.elevationLoss as string),
				},
			});

			revalidatePath("/", "layout");
			return { success: true, reportId: reportId.toString() };
		} else {
			throw new Error("Validation failed. Please check the required fields.");
		}
	} catch (error) {
		console.error("Error adding report:", error);

		// Rollback: Delete uploaded images if an error occurs
		if (reportData.images && reportData.images.length > 0) {
			for (const imageUrl of reportData.images) {
				const publicId = imageUrl.split("/").pop()?.split(".")[0];
				if (publicId) {
					try {
						await cloudinary.uploader.destroy(
							`${cloudinaryFolder}/${publicId}`
						);
					} catch (error) {
						console.error("Error deleting image:", error);
					}
				}
			}
		}

		// Rollback: Delete uploaded GPX file if an error occurs
		if (reportData.gpxFile) {
			const publicId = reportData.gpxFile.split("/").pop()?.split(".")[0];
			if (publicId) {
				try {
					await cloudinary.uploader.destroy(
						`${cloudinaryFolder}/gpx/${publicId}`,
						{
							resource_type: "raw",
						}
					);
				} catch (error) {
					console.error("Error deleting GPX file:", error);
				}
			}
		}

		let errorMessage =
			"An error occurred while adding the report. Please try again.";
		if (error instanceof Error) {
			errorMessage = error.message;
		}

		return { success: false, error: errorMessage };
	}
}

export default addReport;
