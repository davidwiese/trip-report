"use server";

import connectDB from "@/config/database";
import Report from "@/models/Report";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function updateReport(reportId: string, formData: FormData) {
	await connectDB();

	const sessionUser = await getSessionUser();

	// NOTE: throwing an Error from our server actions will be caught by our
	// error.jsx ErrorBoundary component and show the user an Error page with
	// message of the thrown error.

	if (!sessionUser || !sessionUser.userId) {
		throw new Error("User ID is required");
	}

	const { userId } = sessionUser;

	const existingReport = await Report.findById(reportId);

	// Verify ownership
	if (existingReport.owner.toString() !== userId) {
		throw new Error("Current user does not own this report.");
	}

	// Access all values from amenities and images
	const amenities = formData.getAll("amenities");

	// Create propertyData object for database
	const reportData = {
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
			nightly: formData.get("rates.nightly."),
		},
		seller_info: {
			name: formData.get("seller_info.name"),
			email: formData.get("seller_info.email"),
			phone: formData.get("seller_info.phone"),
		},
		owner: userId,
	};

	const updatedReport = await Report.findByIdAndUpdate(reportId, reportData);

	// Revalidate the cache
	// NOTE: since properties are pretty much on every page, we can simply
	// revalidate everything that uses our top level layout
	revalidatePath("/", "layout");

	redirect(`/reports/${updatedReport._id}`);
}

export default updateReport;
