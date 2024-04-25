"use server";

import connectDB from "@/config/database";
import Report from "@/models/Report";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function addReport(formData: FormData) {
	await connectDB();

	const sessionUser = await getSessionUser();

	// NOTE: throwing an Error from our server actions will be caught by our
	// error.jsx ErrorBoundary component and show the user an Error page with
	// message of the thrown error.

	if (!sessionUser || !sessionUser.userId) {
		throw new Error("User ID is required");
	}

	const { userId } = sessionUser;

	const images = formData
		.getAll("images")
		.filter((image) => (image as File).name !== "");

	// Create reportData object for database
	const reportData: {
		owner: string;
		title: FormDataEntryValue | null;
		activityType: FormDataEntryValue | null;
		description: FormDataEntryValue | null;
		location: FormDataEntryValue | null;
		distance: FormDataEntryValue | null;
		elevationGain: FormDataEntryValue | null;
		elevationLoss: FormDataEntryValue | null;
		duration: FormDataEntryValue | null;
		startDate: FormDataEntryValue | null;
		endDate: FormDataEntryValue | null;
		images: string[];
		isFeatured: boolean;
	} = {
		owner: userId,
		title: formData.get("title"),
		activityType: formData.get("activityType"),
		description: formData.get("description"),
		location: formData.get("location"),
		distance: formData.get("distance"),
		elevationGain: formData.get("elevationGain"),
		elevationLoss: formData.get("elevationLoss"),
		duration: formData.get("duration"),
		startDate: formData.get("startDate"),
		endDate: formData.get("endDate"),
		images: [], // Initialize as an empty array of type string[]
		isFeatured: false,
	};

	// Validation for required fields
	const requiredFields = [
		"title",
		"activityType",
		"description",
		"location",
		"distance",
		"elevationGain",
		"elevationLoss",
		"duration",
		"startDate",
		"endDate",
	];
	for (const field of requiredFields) {
		if (!formData.get(field)) {
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

	// Upload image(s) to Cloudinary
	// NOTE: this will be an array of strings, not a array of Promises
	// So imageUploadPromises has been changed to imageUrls to more
	// declaratively represent its type.
	const imageUrls = [];

	for (const imageFile of images) {
		const imageBuffer = await (imageFile as File).arrayBuffer();
		const imageArray = Array.from(new Uint8Array(imageBuffer));
		const imageData = Buffer.from(imageArray);

		// Convert the image data to base64
		const imageBase64 = imageData.toString("base64");

		// Make request to upload to Cloudinary
		const result = await cloudinary.uploader.upload(
			`data:image/png;base64,${imageBase64}`,
			{
				folder: "trip-report",
			}
		);

		imageUrls.push(result.secure_url);

		// Add uploaded images to the reportData object
		reportData.images = imageUrls;
	}

	// NOTE: here there is no need to await the resolution of
	// imageUploadPromises as it's not a array of Promises it's an array of
	// strings, additionally we should not await on every iteration of our loop.

	reportData.images = imageUrls;

	const newReport = new Report(reportData);
	await newReport.save();

	// Revalidate the cache
	// NOTE: since properties are pretty much on every page, we can simply
	// revalidate everything that uses our top level layout
	revalidatePath("/", "layout");

	redirect(`/reports/${newReport._id}`);
}

export default addReport;
