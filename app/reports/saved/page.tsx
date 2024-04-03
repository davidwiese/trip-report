"use client";
import { useState, useEffect } from "react";
import ReportCard from "@/components/ReportCard";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";
import { Report } from "@/types";

type SavedReportsPageProps = {
	// Add any props here if needed
};

const SavedReportsPage: React.FC<SavedReportsPageProps> = () => {
	const [reports, setReports] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSavedReports = async () => {
			try {
				const res = await fetch("/api/bookmarks");
				if (res.status === 200) {
					const data = await res.json();
					setReports(data);
				} else {
					console.log(res.statusText);
					toast.error("Failed to fetch saved reports");
				}
			} catch (error) {
				console.log(error);
				toast.error("Failed to fetch saved reports");
			} finally {
				setLoading(false);
			}
		};
		fetchSavedReports();
	}, []);

	console.log(reports);

	return loading ? (
		<Spinner loading={loading} />
	) : (
		<section className="px-4 py-6">
			<h1 className="text-2xl mb-4">Saved Reports</h1>
			<div className="container-xl lg:container m-auto px-4 py-6">
				{reports.length === 0 ? (
					<p>No saved reports</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{(reports as Report[]).map((report) => (
							<ReportCard key={report._id} report={report} />
						))}
					</div>
				)}
			</div>
		</section>
	);
};
export default SavedReportsPage;
