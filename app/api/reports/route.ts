import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import connectDB from "@/config/database";
import Report from "@/models/Report";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";

// GET /api/reports
export const GET = async (request: NextRequest) => {
	try {
		await connectDB();

		const reports = await Report.find({});

		return Response.json(reports);
	} catch (error) {
		return new Response("Something went wrong", { status: 500 });
	}
};

// POST /api/reports/add
export const POST = async (request: NextRequest) => {
	try {
		await connectDB();

		const sessionUser = await getSessionUser();

		// Handle case where no session/user
		if (!sessionUser || !sessionUser.userId) {
			return new Response("User ID is required", { status: 401 });
		}

		const { userId } = sessionUser;

		const formData = await request.formData();

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

		const newReport = new Report(reportData);
		await newReport.save();

		revalidatePath("/reports");
		return Response.redirect(
			`${process.env.NEXTAUTH_URL}/reports/${newReport._id}`
		);

		// return new Response(JSON.stringify({ message: "Success" }), {
		// 	status: 200,
		// });
	} catch (error) {
		return new Response("Failed to add report", { status: 500 });
	}
};
