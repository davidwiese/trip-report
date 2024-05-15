"use server";

import connectDB from "@/config/database";
import Report from "@/models/Report";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/config/cloudinary";

async function updateReport(reportId: string, formData: FormData) {
	await connectDB();

	const sessionUser = await getSessionUser();

	if (!sessionUser || !sessionUser.userId) {
		throw new Error("User ID is required");
	}

	const { userId } = sessionUser;

	const existingReport = await Report.findById(reportId);

	if (!existingReport) {
		throw new Error("Report not found");
	}

	// Verify ownership
	if (existingReport.owner.toString() !== userId) {
		throw new Error("Current user does not own this report");
	}

	// Handle removed images
	const imagesToRemove = formData.getAll("imagesToRemove").map(String);
	for (const imageUrl of imagesToRemove) {
		const fileName = imageUrl.split("/").pop()?.split(".")[0];
		if (fileName) {
			await cloudinary.uploader.destroy(`trip-report/${fileName}`);
		}
	}

	const newImages = [];
	const files = formData.getAll("images");
	for (const file of files) {
		if (file instanceof File) {
			// Convert the file to a base64 string
			const fileBuffer = await file.arrayBuffer();
			const base64 = Buffer.from(fileBuffer).toString("base64");
			const fileMime = file.type;
			const base64File = `data:${fileMime};base64,${base64}`;

			// Upload to Cloudinary
			const uploadResult = await cloudinary.uploader.upload(base64File, {
				folder: "trip-report",
				resource_type: "image", // Assuming these are images
			});
			newImages.push(uploadResult.secure_url);
		}
	}

	// Update the GPX/KML file
	let gpxKmlFileUrl = existingReport.gpxKmlFile;
	const gpxKmlFile = formData.get("gpxKmlFile");

	if (gpxKmlFile && gpxKmlFile instanceof File) {
		// If a new GPX file is provided, remove the old one from Cloudinary (if it exists)
		if (existingReport.gpxKmlFile) {
			await cloudinary.uploader.destroy(existingReport.gpxKmlFile, {
				resource_type: "raw",
			});
		}

		const fileBuffer = await gpxKmlFile.arrayBuffer();
		const base64 = Buffer.from(fileBuffer).toString("base64");
		const fileMime = gpxKmlFile.type;
		const base64File = `data:${fileMime};base64,${base64}`;

		const uploadResult = await cloudinary.uploader.upload(base64File, {
			folder: "trip-report/gpx",
			resource_type: "raw",
		});
		gpxKmlFileUrl = uploadResult.secure_url;
	} else if (formData.get("removeGpxKmlFile") === "true") {
		// If there's a request to remove the existing GPX/KML file
		if (existingReport.gpxKmlFile) {
			await cloudinary.uploader.destroy(existingReport.gpxKmlFile, {
				resource_type: "raw",
			});
		}
		gpxKmlFileUrl = ""; // Clear the URL if the file is removed
	}

	// Create reportData object for database
	const reportData = {
		title: formData.get("title"),
		activityType: formData.getAll("activityType") as string[],
		description: formData.get("description"),
		body: formData.get("body"),
		location: {
			country: formData.get("location.country"),
			region: formData.get("location.region"),
			localArea: formData.get("location.localArea"),
		},
		distance: formData.get("distance"),
		elevationGain: formData.get("elevationGain"),
		elevationLoss: formData.get("elevationLoss"),
		duration: formData.get("duration"),
		startDate: formData.get("startDate"),
		endDate: formData.get("endDate"),
		caltopoUrl: formData.get("caltopoUrl"),
		gpxKmlFile: gpxKmlFileUrl,
		images: [
			...existingReport.images.filter(
				(img: string) => !imagesToRemove.includes(img)
			),
			...newImages,
		],
	};

	const updatedReport = await Report.findByIdAndUpdate(reportId, reportData, {
		new: true,
	});

	// Revalidate the cache
	// NOTE: since reports are pretty much on every page, we can simply
	// revalidate everything that uses our top level layout
	revalidatePath("/", "layout");

	redirect(`/reports/${updatedReport._id}`);
}

export default updateReport;
