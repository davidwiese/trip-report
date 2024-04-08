"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

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

	return <div>SearchResultsPage</div>;
};
export default SearchResultsPage;
