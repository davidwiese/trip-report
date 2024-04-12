import { NextRequest } from "next/server";
import connectDB from "@/config/database";
import Report from "@/models/Report";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";

// GET /api/reports/:id
export const GET = async (
	request: NextRequest,
	{ params }: { params: { [key: string]: string } }
) => {
	try {
		await connectDB();

		const report = await Report.findById(params.id);

		if (!report) return new Response("Report not found", { status: 404 });

		return Response.json(report);
	} catch (error) {
		return new Response("Something went wrong", { status: 500 });
	}
};

// DELETE /api/reports/:id
export const DELETE = async (
	request: NextRequest,
	{ params }: { params: { [key: string]: string } }
) => {
	try {
		const reportId = params.id;

		const sessionUser = await getSessionUser();

		// Check for session
		if (!sessionUser || !sessionUser.userId) {
			return new Response("User ID is required", { status: 401 });
		}

		const { userId } = sessionUser;

		await connectDB();

		const report = await Report.findById(reportId);

		if (!report) return new Response("Report not found", { status: 404 });

		// Verify ownership
		if (report.owner.toString() !== userId) {
			return new Response("Unauthorized", { status: 401 });
		}

		// extract public id's from image url in DB
		const publicIds = report.images.map((imageUrl: string) => {
			const parts = imageUrl.split("/");
			const lastPart = parts.at(-1);
			return lastPart ? lastPart.split(".").at(0) : undefined;
		});

		// Filter out any undefined publicIds
		const validPublicIds = publicIds.filter(
			(publicId: string): publicId is string => publicId !== undefined
		);

		// Delete images from Cloudinary
		if (validPublicIds.length > 0) {
			for (let publicId of validPublicIds) {
				await cloudinary.uploader.destroy("trip-report/" + publicId);
			}
		}

		await report.deleteOne();

		return new Response("Report deleted", { status: 200 });
	} catch (error) {
		return new Response("Something went wrong", { status: 500 });
	}
};

// PUT /api/reports/:id
export const PUT = async (
	request: NextRequest,
	{ params }: { params: { [key: string]: string } }
) => {
	try {
		await connectDB();

		const sessionUser = await getSessionUser();

		// Handle case where no session/user
		if (!sessionUser || !sessionUser.userId) {
			return new Response("User ID is required", { status: 401 });
		}

		const { id } = params;
		const { userId } = sessionUser;

		const formData = await request.formData();

		// Access all values from amenities
		const amenities = formData
			.getAll("amenities")
			.map((amenity) => amenity.toString());

		// Get report to update
		const existingReport = await Report.findById(id);

		if (!existingReport) {
			return new Response("Report does not exist", { status: 404 });
		}

		// Verify ownership
		if (existingReport.owner.toString() !== userId) {
			return new Response("Unauthorized", { status: 401 });
		}

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
		};

		// Update report in database
		const updatedReport = await Report.findByIdAndUpdate(id, reportData);

		return Response.json(updatedReport);
	} catch (error) {
		return new Response("Failed to edit report", { status: 500 });
	}
};
