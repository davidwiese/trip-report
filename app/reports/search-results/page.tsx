import Pagination from "@/components/Pagination";
import ReportCard from "@/components/ReportCard";
import ReportSearchForm from "@/components/ReportSearchForm";
import connectDB from "@/config/database";
import Report from "@/models/Report";
import { convertToSerializableObject } from "@/utils/convertToObject";
import { Metadata } from "next";
import Link from "next/link";
import { FaArrowAltCircleLeft } from "react-icons/fa";

type SearchResultsPageProps = {
	searchParams: {
		location: string;
		reportType: string;
		pageSize?: string;
		page?: string;
	};
};

async function loader(
	location: string,
	reportType: string,
	pageSize: number,
	page: number
) {
	await connectDB();

	const locationPattern = new RegExp(location, "i");

	let query: any = {
		$or: [
			{ title: locationPattern },
			{ description: locationPattern },
			{ body: locationPattern },
			{ "location.country": locationPattern },
			{ "location.region": locationPattern },
			{ "location.localArea": locationPattern },
			{ "location.objective": locationPattern },
		],
	};

	if (reportType && reportType !== "All") {
		query.activityType = reportType;
	}

	const totalReports = await Report.countDocuments(query);
	const totalPages = Math.ceil(totalReports / pageSize);

	// Ensure the page is within valid range
	let currentPage = page;
	if (currentPage < 1 || currentPage > totalPages) {
		currentPage = 1;
	}

	const skip = (currentPage - 1) * pageSize;

	const reportsQueryResults = await Report.find(query)
		.skip(skip)
		.limit(pageSize)
		.lean();
	const reports = convertToSerializableObject(reportsQueryResults);

	return {
		reports,
		totalReports,
		currentPage,
	};
}

export const metadata: Metadata = {
	title: "Search Results | Trip Report",
	description: "Explore trip reports matching your search criteria.",
	robots: { index: false, follow: true }, // Allow following links, but don't index search results
};

const SearchResultsPage: React.FC<SearchResultsPageProps> = async ({
	searchParams: { location, reportType, pageSize = "6", page = "1" },
}) => {
	const validPage = parseInt(page, 10) || 1;
	const validPageSize = parseInt(pageSize, 10) || 6;

	const { reports, totalReports, currentPage } = await loader(
		location,
		reportType,
		validPageSize,
		validPage
	);

	return (
		<>
			<section className="bg-black text-white py-4">
				<div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
					<ReportSearchForm />
				</div>
			</section>
			<section className="px-4 py-6">
				<div className="container-xl lg:container m-auto px-4 py-6">
					<Link
						href="/reports"
						className="flex items-center text-gray-500 hover:underline mb-3"
					>
						<FaArrowAltCircleLeft className="mr-2 mb-1" /> Back To Reports
					</Link>
					<h1 className="text-2xl mb-4">Search Results</h1>
					{reports.length === 0 ? (
						<p>No search results found</p>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{reports.map((report: any) => (
								<ReportCard key={report._id} report={report} />
							))}
						</div>
					)}
					{totalReports > 0 && (
						<Pagination
							page={currentPage}
							pageSize={validPageSize}
							totalItems={totalReports}
							basePath={`/reports/search-results?location=${encodeURIComponent(
								location
							)}&reportType=${encodeURIComponent(reportType)}`}
						/>
					)}
				</div>
			</section>
		</>
	);
};
export default SearchResultsPage;
