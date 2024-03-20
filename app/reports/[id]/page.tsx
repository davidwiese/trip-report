"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchReport } from "@/utils/requests";

type ReportPageProps = {
	// Add any props here if needed
};

const ReportPage: React.FC<ReportPageProps> = () => {
	const { id } = useParams();

	const [report, setReport] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchReportData = async () => {
			if (!id || Array.isArray(id)) return;
			try {
				const report = await fetchReport(id);
				setReport(report);
			} catch (error) {
				console.error("Error fetching report: ", error);
			} finally {
				setLoading(false);
			}
		};

		if (report === null) {
			fetchReportData();
		}
	}, [id, report]);

	return <div>ReportPage</div>;
};
export default ReportPage;
