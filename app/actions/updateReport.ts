"use server";

import connectDB from "@/config/database";
import Report from "@/models/Report";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/config/cloudinary";
import { v4 as uuidv4 } from "uuid";

async function updateReport(reportId: string, formData: FormData) {
	let updatedReport;

	try {
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
			const urlParts = imageUrl.split("/").pop()?.split(".");
			const fileExtension = urlParts?.pop();
			const publicId = urlParts?.join(".");
			if (publicId) {
				try {
					const result = await cloudinary.uploader.destroy(
						`trip-report/${publicId}`
					);
				} catch (error) {
					console.error("Error removing image from Cloudinary:", error);
				}
			}
		}

		// Handle new images
		const newImages = [];
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

		for (const file of files) {
			if (file instanceof File && file.size > 0) {
				// Convert the file to a base64 string
				const fileBuffer = await file.arrayBuffer();
				const base64 = Buffer.from(fileBuffer).toString("base64");
				const fileMime = file.type;
				const base64File = `data:${fileMime};base64,${base64}`;

				// Get the file extension
				const fileExtension = file.name.substring(
					file.name.lastIndexOf(".") + 1
				);

				// Generate a unique file name using uuidv4
				const uniqueFileName = `${uuidv4()}.${fileExtension}`;

				// Upload to Cloudinary
				const uploadResult = await cloudinary.uploader.upload(base64File, {
					folder: "trip-report",
					resource_type: "image",
					public_id: uniqueFileName,
				});
				newImages.push(uploadResult.secure_url);
			}
		}

		// Merge new images with existing images and filter out any images marked for removal
		const finalImages = [
			...(existingReport.images || []).filter(
				(image: string) => !imagesToRemove.includes(image)
			),
			...newImages,
		];

		// Update the GPX/KML file
		let gpxKmlFileUrl: string | undefined | null = existingReport.gpxKmlFile;
		const gpxKmlFile = formData.get("gpxKmlFile");
		const removeGpxKmlFile = formData.get("removeGpxKmlFile");

		if (removeGpxKmlFile === "true") {
			// If there's a request to remove the existing GPX/KML file
			if (existingReport.gpxKmlFile) {
				const publicId = existingReport.gpxKmlFile.split("/").pop();
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
								`Failed to remove GPX/KML file: ${result.result}`
							);
						}
					} catch (error) {
						console.error(
							"Error removing GPX/KML file from Cloudinary:",
							error
						);
						throw new Error("Failed to remove GPX/KML file from Cloudinary");
					}
				}
			}
			gpxKmlFileUrl = null; // Set the URL to null if the file is removed
		} else if (gpxKmlFile instanceof File && gpxKmlFile.size > 0) {
			// If a new GPX file is provided, remove the old one from Cloudinary (if it exists)
			if (existingReport.gpxKmlFile) {
				const publicId = existingReport.gpxKmlFile.split("/").pop();
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
								`Failed to remove old GPX/KML file: ${result.result}`
							);
						}
					} catch (error) {
						console.error(
							"Error removing old GPX/KML file from Cloudinary:",
							error
						);
						throw new Error(
							"Failed to remove old GPX/KML file from Cloudinary"
						);
					}
				}
			}

			const fileBuffer = await gpxKmlFile.arrayBuffer();
			const base64 = Buffer.from(fileBuffer).toString("base64");
			const fileMime = gpxKmlFile.type;
			const base64File = `data:${fileMime};base64,${base64}`;

			const fileExtension = gpxKmlFile.name.substring(
				gpxKmlFile.name.lastIndexOf(".") + 1
			);
			const uniqueFileName = `${uuidv4()}.${fileExtension}`;

			const uploadResult = await cloudinary.uploader.upload(base64File, {
				folder: "trip-report/gpx",
				resource_type: "raw",
				public_id: uniqueFileName,
			});
			gpxKmlFileUrl = uploadResult.secure_url;
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
			gpxKmlFile?: string | undefined | null;
			images?: string[];
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
			images: finalImages, // Conditionally add the images array
		};

		if (gpxKmlFileUrl === null || caltopoUrl === null) {
			// Create an object to unset fields
			const unsetFields: any = {};
			if (gpxKmlFileUrl === null) {
				unsetFields.gpxKmlFile = 1;
				reportData.gpxKmlFile = undefined;
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
	} catch (error) {
		console.log("Error updating report:", error);
		throw new Error("Failed to update report");
	}

	// Revalidate the cache
	// NOTE: since reports are pretty much on every page, we can simply
	// revalidate everything that uses our top level layout
	revalidatePath(`/reports/${reportId}`);
	revalidatePath(`/reports/${reportId}/edit`, "layout");
	revalidatePath("/", "layout");

	redirect(`/reports/${updatedReport._id}`);
}

export default updateReport;
