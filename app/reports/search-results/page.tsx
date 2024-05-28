import Link from "next/link";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import ReportCard from "@/components/ReportCard";
import Report from "@/models/Report";
import ReportSearchForm from "@/components/ReportSearchForm";
import connectDB from "@/config/database";
import { convertToSerializableObject } from "@/utils/convertToObject";

type SearchResultsPageProps = {
	searchParams: {
		location: string;
		reportType: string;
	};
};

const SearchResultsPage: React.FC<SearchResultsPageProps> = async ({
	searchParams: { location, reportType },
}) => {
	await connectDB();

	const locationPattern = new RegExp(location, "i");

	// Match location pattern against database fields
	let query: any = {
		$or: [
			{ name: locationPattern },
			{ description: locationPattern },
			{ "location.street": locationPattern },
			{ "location.city": locationPattern },
			{ "location.state": locationPattern },
			{ "location.zipcode": locationPattern },
		],
	};

	// Only check for report if its not 'All'
	if (reportType && reportType !== "All") {
		const typePattern = new RegExp(reportType, "i");
		query.type = typePattern;
	}

	const reportsQueryResults = await Report.find(query).lean();
	const reports = convertToSerializableObject(reportsQueryResults);

	return (
		<>
			<section className="bg-black py-4">
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
							{(reports as Report[]).map((report: any) => (
								<ReportCard key={report._id} report={report} />
							))}
						</div>
					)}
				</div>
			</section>
		</>
	);
};
export default SearchResultsPage;
