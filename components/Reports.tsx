"use client";
import { Report } from "@/types";
import { useState, useEffect } from "react";
import ReportCard from "@/components/ReportCard";
import Spinner from "@/components/Spinner";
import Pagination from "@/components/Pagination";

type ReportsProps = {
	// Add any props here if needed
};

const Reports: React.FC<ReportsProps> = () => {
	const [reports, setReports] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(6);
	const [totalItems, setTotalItems] = useState(0);

	useEffect(() => {
		const fetchReports = async () => {
			try {
				const res = await fetch(
					`/api/reports?page=${page}&pageSize=${pageSize}`
				);
				if (!res.ok) {
					throw new Error("Failed to fetch data");
				}
				const data = await res.json();
				setReports(data.reports);
				setTotalItems(data.total);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};
		fetchReports();
	}, [page, pageSize]);

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	return loading ? (
		<Spinner loading={loading} />
	) : (
		<section className="px-4 py-6">
			<div className="container-xl lg:container m-auto px-4 py-6">
				{reports.length === 0 ? (
					<p>No reports found</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{(reports as Report[]).map((report) => (
							<ReportCard key={report._id} report={report} />
						))}
					</div>
				)}
				<Pagination
					page={page}
					pageSize={pageSize}
					totalItems={totalItems}
					onPageChange={handlePageChange}
				/>
			</div>
		</section>
	);
};
export default Reports;
