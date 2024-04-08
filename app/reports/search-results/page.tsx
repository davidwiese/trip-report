"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import ReportCard from "@/components/ReportCard";
import Spinner from "@/components/Spinner";
import { Report } from "@/types";
import ReportSearchForm from "@/components/ReportSearchForm";

type SearchResultsPageProps = {
	// Add any props here if needed
};

const SearchResultsPage: React.FC<SearchResultsPageProps> = () => {
	const searchParams = useSearchParams();
	const [reports, setReports] = useState([]);
	const [loading, setLoading] = useState(true);

	const location = searchParams.get("location");
	const reportType = searchParams.get("reportType");

	useEffect(() => {
		const fetchSearchResults = async () => {
			try {
				const res = await fetch(
					`/api/reports/search?location=${location}&reportType=${reportType}`
				);
				if (res.status === 200) {
					const data = await res.json();
					setReports(data);
				} else {
					setReports([]);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		fetchSearchResults();
	}, [location, reportType]);

	return (
		<>
			<section className="bg-blue-700 py-4">
				<div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
					<ReportSearchForm />
				</div>
			</section>
			{loading ? (
				<Spinner loading={loading} />
			) : (
				<section className="px-4 py-6">
					<div className="container-xl lg:container m-auto px-4 py-6">
						<Link
							href="/reports"
							className="flex items-center text-blue-500 hover:underline mb-3"
						>
							<FaArrowAltCircleLeft className="mr-2 mb-1" /> Back To Reports
						</Link>
						<h1 className="text-2xl mb-4">Search Results</h1>
						{reports.length === 0 ? (
							<p>No search results found</p>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{(reports as Report[]).map((report) => (
									<ReportCard key={report._id} report={report} />
								))}
							</div>
						)}
					</div>
				</section>
			)}
		</>
	);
};
export default SearchResultsPage;
