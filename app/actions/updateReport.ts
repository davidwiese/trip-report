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

	// Handle new images
	const newImages = [];
	const files = formData.getAll("images");
	const existingImageCount = existingReport.images.length;
	const markedForRemovalCount = imagesToRemove.length;
	const newImageCount = files.length;
	const totalImages =
		existingImageCount - markedForRemovalCount + newImageCount;

	if (totalImages > 5) {
		throw new Error("You can have a maximum of 5 images in total.");
	}

	for (const file of files) {
		if (file instanceof File && file.size > 0) {
			// Convert the file to a base64 string
			const fileBuffer = await file.arrayBuffer();
			const base64 = Buffer.from(fileBuffer).toString("base64");
			const fileMime = file.type;
			const base64File = `data:${fileMime};base64,${base64}`;

			// Get the original file name and extension
			const originalFileName = file.name;
			const fileExtension = originalFileName.substring(
				originalFileName.lastIndexOf(".") + 1
			);

			// Upload to Cloudinary
			const uploadResult = await cloudinary.uploader.upload(base64File, {
				folder: "trip-report",
				resource_type: "image",
				public_id: `${originalFileName.substring(
					0,
					originalFileName.lastIndexOf(".")
				)}`,
				format: fileExtension,
			});
			newImages.push(uploadResult.secure_url);
		}
	}

	// Update the GPX/KML file
	let gpxKmlFileUrl: string | undefined = existingReport.gpxKmlFile;
	const gpxKmlFile = formData.get("gpxKmlFile");

	if (gpxKmlFile && gpxKmlFile instanceof File && gpxKmlFile.size > 0) {
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

		// Get the original file name and extension
		const originalFileName = gpxKmlFile.name;
		const fileExtension = originalFileName.substring(
			originalFileName.lastIndexOf(".") + 1
		);

		const uploadResult = await cloudinary.uploader.upload(base64File, {
			folder: "trip-report/gpx",
			resource_type: "raw",
			public_id: `${originalFileName.substring(
				0,
				originalFileName.lastIndexOf(".")
			)}`,
			format: fileExtension,
		});
		gpxKmlFileUrl = uploadResult.secure_url;
	} else if (formData.get("removeGpxKmlFile") === "true") {
		// If there's a request to remove the existing GPX/KML file
		if (existingReport.gpxKmlFile) {
			await cloudinary.uploader.destroy(existingReport.gpxKmlFile, {
				resource_type: "raw",
			});
		}
		gpxKmlFileUrl = undefined; // Set the URL to undefined if the file is removed
	}

	// Handle Caltopo URL
	let caltopoUrl = formData.get("caltopoUrl") as FormDataEntryValue | null;
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
		gpxKmlFile?: string | undefined;
		images: string[];
	} = {
		title: formData.get("title"),
		activityType: formData.getAll("activityType") as string[],
		description: formData.get("description"),
		body: formData.get("body"),
		location: {
			country: formData.get("location.country"),
			region: formData.get("location.region"),
			localArea: formData.get("location.localArea"),
			objective: formData.get("location.objective"),
		},
		distance: formData.get("distance"),
		elevationGain: formData.get("elevationGain"),
		elevationLoss: formData.get("elevationLoss"),
		duration: formData.get("duration"),
		startDate: formData.get("startDate"),
		endDate: formData.get("endDate"),
		caltopoUrl: caltopoUrl, // Conditionally add the Caltopo URL
		gpxKmlFile: gpxKmlFileUrl, // Conditionally add the gpxKmlFile URL
		images: [
			...existingReport.images.filter(
				(img: string) => !imagesToRemove.includes(img)
			),
			...newImages,
		],
	};

	// Remove undefined keys from the reportData object
	Object.keys(reportData).forEach((key) => {
		if (reportData[key as keyof typeof reportData] === undefined) {
			delete reportData[key as keyof typeof reportData];
		}
	});

	const updatedReport = await Report.findByIdAndUpdate(reportId, reportData, {
		new: true,
	});

	// Revalidate the cache
	// NOTE: since reports are pretty much on every page, we can simply
	// revalidate everything that uses our top level layout
	revalidatePath(`/reports/${reportId}`);
	revalidatePath("/", "layout");

	redirect(`/reports/${updatedReport._id}`);
}

export default updateReport;
