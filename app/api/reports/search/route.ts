import connectDB from "@/config/database";
import { NextRequest } from "next/server";
import Report from "@/models/Report";

// GET /api/reports/search
export const GET = async (request: NextRequest) => {
	try {
		await connectDB();
		// Get query params from URL
		const { searchParams } = new URL(request.url);
		const location = searchParams.get("location");
		const reportType = searchParams.get("reportType");

		const locationPattern = location ? new RegExp(location, "i") : null;

		// Match location pattern against database fields
		let query: any = {};
		if (locationPattern) {
			query.$or = [
				{ name: locationPattern },
				{ description: locationPattern },
				{ "location.street": locationPattern },
				{ "location.city": locationPattern },
				{ "location.state": locationPattern },
				{ "location.zipcode": locationPattern },
			];
		}

		// Only check for report if it's not "All"
		if (reportType && reportType !== "All") {
			const typePattern = new RegExp(reportType, "i");
			query.type = typePattern;
		}

		const reports = await Report.find(query);

		return new Response(JSON.stringify(reports), {
			status: 200,
		});
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify("Something went wrong"), {
			status: 500,
		});
	}
};
