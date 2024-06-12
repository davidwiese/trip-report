"use server";

import connectDB from "@/config/database";
import Report from "@/models/Report";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { sanitizeHtmlContent } from "@/utils/sanitizeHtml";

async function addReport(formData: FormData) {
	let redirectUrl = "";
	let reportData: any = {};

	try {
		await connectDB();

		const sessionUser = await getSessionUser();

		// NOTE: throwing an Error from our server actions will be caught by our
		// error.jsx ErrorBoundary component and show the user an Error page with
		// message of the thrown error.

		if (!sessionUser || !sessionUser.userId) {
			throw new Error("User ID is required");
		}

		const { userId } = sessionUser;

		type LocationType = {
			country: FormDataEntryValue;
			region: FormDataEntryValue;
			localArea: FormDataEntryValue;
			objective: FormDataEntryValue;
		};

		// Create reportData object for database
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
			gpxKmlFile?: { url: string; originalFilename: string };
			caltopoUrl?: FormDataEntryValue | null;
			isFeatured: boolean;
		} = {
			owner: userId,
			title: formData.get("title"),
			activityType: formData.getAll("activityType") as string[],
			description: formData.get("description"),
			body: sanitizeHtmlContent(formData.get("body") as string),
			location: {
				country: formData.get("location.country")!,
				region: formData.get("location.region")!,
				localArea: formData.get("location.localArea")!,
				objective: formData.get("location.objective")!,
			},
			distance: formData.get("distance"),
			elevationGain: formData.get("elevationGain"),
			elevationLoss: formData.get("elevationLoss"),
			duration: formData.get("duration"),
			startDate: formData.get("startDate"),
			endDate: formData.get("endDate"),
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
				if (typeof bodyValue === "string" && bodyValue.trim() === "") {
					reportData.body =
						"<h2>Type your Trip Report here...</h2><p>Format it with the menu bar above.</p>";
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

		// If validation passes, proceed with file uploads and saving the report
		if (requiredFieldsValid && numericFieldsValid) {
			// Handle GPX/KML file upload to Cloudinary
			const gpxKmlFile = formData.get("gpxKmlFile") as File | null;
			let gpxKmlFileUrl: { url: string; originalFilename: string } | undefined;

			if (gpxKmlFile && gpxKmlFile.size > 0) {
				const fileBuffer = await gpxKmlFile.arrayBuffer();
				const base64 = Buffer.from(fileBuffer).toString("base64");
				const fileMime = gpxKmlFile.type;
				const base64File = `data:${fileMime};base64,${base64}`;

				const fileExtension = gpxKmlFile.name.substring(
					gpxKmlFile.name.lastIndexOf(".") + 1
				);

				const result = await cloudinary.uploader.upload(base64File, {
					folder: "trip-report/gpx",
					resource_type: "raw",
					public_id: `${uuidv4()}.${fileExtension}`,
				});
				gpxKmlFileUrl = {
					url: result.secure_url,
					originalFilename: gpxKmlFile.name,
				};
			}

			// Conditionally add gpxKmlFile if it has a value
			if (gpxKmlFileUrl) {
				reportData.gpxKmlFile = gpxKmlFileUrl;
			}

			// Conditionally add caltopoUrl if it has a value
			const caltopoUrl = formData.get("caltopoUrl");
			if (caltopoUrl) {
				reportData.caltopoUrl = caltopoUrl;
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

			// Convert distance, elevation gain, and elevation loss to numbers
			const distance = parseFloat(reportData.distance as string);
			const elevationGain = parseFloat(reportData.elevationGain as string);
			const elevationLoss = parseFloat(reportData.elevationLoss as string);

			// Update the user's reports array and totals
			await User.findByIdAndUpdate(userId, {
				$push: { reports: newReport._id },
				$inc: {
					totalReports: 1,
					totalDistance: distance,
					totalElevationGain: elevationGain,
					totalElevationLoss: elevationLoss,
				},
			});

			// Set the redirect URL
			redirectUrl = `/reports/${newReport._id}`;
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
						await cloudinary.uploader.destroy(`trip-report/${publicId}`);
					} catch (error) {
						console.error("Error deleting image:", error);
					}
				}
			}
		}

		// Rollback: Delete uploaded GPX/KML file if an error occurs
		if (reportData.gpxKmlFile) {
			const publicId = reportData.gpxKmlFile.split("/").pop()?.split(".")[0];
			if (publicId) {
				try {
					await cloudinary.uploader.destroy(`trip-report/gpx/${publicId}`, {
						resource_type: "raw",
					});
				} catch (error) {
					console.error("Error deleting GPX/KML file:", error);
				}
			}
		}

		throw new Error(
			"An error occurred while adding the report. Please try again."
		);
	}
	// Revalidate the cache
	// NOTE: since reports are pretty much on every page, we can simply
	// revalidate everything that uses our top level layout
	revalidatePath("/", "layout");

	if (redirectUrl) {
		redirect(redirectUrl);
	}
}

export default addReport;
