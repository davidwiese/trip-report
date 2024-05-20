"use server";

import connectDB from "@/config/database";
import Report from "@/models/Report";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

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
			body: formData.get("body"),
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

			// Handle image(s) upload to Cloudinary
			const images = formData.getAll("images").filter((image) => {
				const file = image as File;
				return file && file.size > 0 && file.name !== "undefined";
			}) as File[];

			// Conditionally add images if they exist
			if (images.length > 0) {
				const imageUrls: { url: string; originalFilename: string }[] = [];

				for (const imageFile of images) {
					const imageBuffer = await imageFile.arrayBuffer();
					const base64 = Buffer.from(imageBuffer).toString("base64");
					const fileMime = imageFile.type;
					const base64File = `data:${fileMime};base64,${base64}`;

					const result = await cloudinary.uploader.upload(base64File, {
						folder: "trip-report",
						resource_type: "image",
						public_id: `${uuidv4()}`,
					});

					imageUrls.push({
						url: result.secure_url,
						originalFilename: imageFile.name,
					});
				}

				if (imageUrls.length > 0) {
					reportData.images = imageUrls;
				}
			}

			const newReport = new Report(reportData);
			await newReport.save();

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
