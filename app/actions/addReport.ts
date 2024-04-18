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

	// Access all values from amenities and images
	const amenities = formData
		.getAll("amenities")
		.map((amenity) => amenity.toString());

	const images = formData
		.getAll("images")
		.filter((image) => (image as File).name !== "");

	// Create reportData object for database
	const reportData: {
		type: FormDataEntryValue | null;
		name: FormDataEntryValue | null;
		description: FormDataEntryValue | null;
		location: {
			street: FormDataEntryValue | null;
			city: FormDataEntryValue | null;
			state: FormDataEntryValue | null;
			zipcode: FormDataEntryValue | null;
		};
		beds: FormDataEntryValue | null;
		baths: FormDataEntryValue | null;
		square_feet: FormDataEntryValue | null;
		amenities: string[];
		rates: {
			weekly: FormDataEntryValue | null;
			monthly: FormDataEntryValue | null;
			nightly: FormDataEntryValue | null;
		};
		seller_info: {
			name: FormDataEntryValue | null;
			email: FormDataEntryValue | null;
			phone: FormDataEntryValue | null;
		};
		owner: string;
		images: string[]; // Update the type to string[]
	} = {
		type: formData.get("type"),
		name: formData.get("name"),
		description: formData.get("description"),
		location: {
			street: formData.get("location.street"),
			city: formData.get("location.city"),
			state: formData.get("location.state"),
			zipcode: formData.get("location.zipcode"),
		},
		beds: formData.get("beds"),
		baths: formData.get("baths"),
		square_feet: formData.get("square_feet"),
		amenities,
		rates: {
			weekly: formData.get("rates.weekly"),
			monthly: formData.get("rates.monthly"),
			nightly: formData.get("rates.nightly"),
		},
		seller_info: {
			name: formData.get("seller_info.name"),
			email: formData.get("seller_info.email"),
			phone: formData.get("seller_info.phone"),
		},
		owner: userId,
		images: [], // Initialize as an empty array of type string[]
	};

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
