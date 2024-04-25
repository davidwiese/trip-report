"use server";

import connectDB from "@/config/database";
import Report from "@/models/Report";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function updateReport(reportId: string, formData: FormData) {
	await connectDB();

	const sessionUser = await getSessionUser();

	if (!sessionUser || !sessionUser.userId) {
		throw new Error("User ID is required");
	}

	const { userId } = sessionUser;

	const existingReport = await Report.findById(reportId);

	// Verify ownership
	if (existingReport.owner.toString() !== userId) {
		throw new Error("Current user does not own this report.");
	}

	// Create reportData object for database
	const reportData = {
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
	};

	const updatedReport = await Report.findByIdAndUpdate(reportId, reportData);

	// Revalidate the cache
	// NOTE: since reports are pretty much on every page, we can simply
	// revalidate everything that uses our top level layout
	revalidatePath("/", "layout");

	redirect(`/reports/${updatedReport._id}`);
}

export default updateReport;
