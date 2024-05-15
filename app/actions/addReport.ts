"use server";

import connectDB from "@/config/database";
import Report from "@/models/Report";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function addReport(formData: FormData) {
	let redirectUrl = "";

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
			images?: string[];
			gpxKmlFile?: string;
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

		// Handle GPX/KML file upload to Cloudinary
		const gpxKmlFile = formData.get("gpxKmlFile") as File | null;
		let gpxKmlFileUrl: string | undefined;

		if (gpxKmlFile && gpxKmlFile.size > 0) {
			// Convert file to buffer
			const fileBuffer = await gpxKmlFile.arrayBuffer();
			const base64 = Buffer.from(fileBuffer).toString("base64");
			const fileMime = gpxKmlFile.type;
			const base64File = `data:${fileMime};base64,${base64}`;

			// Get the original file name and extension
			const originalFileName = gpxKmlFile.name;
			const fileExtension = originalFileName.substring(
				originalFileName.lastIndexOf(".") + 1
			);

			// Upload to Cloudinary
			const result = await cloudinary.uploader.upload(base64File, {
				folder: "trip-report/gpx",
				resource_type: "raw",
				public_id: `${originalFileName.substring(
					0,
					originalFileName.lastIndexOf(".")
				)}`,
				format: fileExtension,
			});
			gpxKmlFileUrl = result.secure_url;
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
			const imageUrls: string[] = [];

			for (const imageFile of images) {
				const imageBuffer = await imageFile.arrayBuffer();
				const base64 = Buffer.from(imageBuffer).toString("base64");
				const fileMime = imageFile.type;
				const base64File = `data:${fileMime};base64,${base64}`;

				const originalFileName = imageFile.name;
				const fileExtension = originalFileName.substring(
					originalFileName.lastIndexOf(".") + 1
				);

				const result = await cloudinary.uploader.upload(base64File, {
					folder: "trip-report",
					resource_type: "image",
					public_id: `${originalFileName.substring(
						0,
						originalFileName.lastIndexOf(".")
					)}`,
					format: fileExtension,
				});

				imageUrls.push(result.secure_url);
			}

			if (imageUrls.length > 0) {
				reportData.images = imageUrls;
			}
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
				if (!formData.getAll(field).length) {
					throw new Error(`${field} is required`);
				}
			} else if (field === "body") {
				const bodyValue = formData.get(field);
				if (typeof bodyValue === "string" && bodyValue.trim() === "") {
					// Set default content for the body field if it's empty or contains only whitespace
					reportData.body =
						"<h2>Type your Trip Report here...</h2><p>Format it with the menu bar above.</p>";
				}
			} else if (!formData.get(field)) {
				throw new Error(`${field} is required`);
			}
		}

		const numericFields = [
			"distance",
			"elevationGain",
			"elevationLoss",
			"duration",
		];
		numericFields.forEach((field) => {
			const value = formData.get(field);
			if (value && isNaN(Number(value))) {
				throw new Error(`${field} must be a number`);
			}
		});

		// NOTE: here there is no need to await the resolution of
		// imageUploadPromises as it's not a array of Promises it's an array of
		// strings, additionally we should not await on every iteration of our loop.
		const newReport = new Report(reportData);
		await newReport.save();

		// Set the redirect URL
		redirectUrl = `/reports/${newReport._id}`;
	} catch (error) {
		console.error("Error adding report:", error);
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
