"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchReport } from "@/utils/requests";
import { Report } from "@/types";
import ReportHeaderImage from "@/components/ReportHeaderImage";
import ReportDetails from "@/components/ReportDetails";
import { FaArrowLeft } from "react-icons/fa";
import Spinner from "@/components/Spinner";
import ReportImages from "@/components/ReportImages";
import BookmarkButton from "@/components/BookmarkButton";
import ShareButtons from "@/components/ShareButtons";
import ReportContactForm from "@/components/ReportContactForm";

type ReportPageProps = {
	// Add any props here if needed
};

const ReportPage: React.FC<ReportPageProps> = () => {
	const { id } = useParams();

	const [report, setReport] = useState<Report | null>(null);
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

	if (!report && !loading) {
		return (
			<h1 className="text-center text-2xl font-bold mt-10">Report not found</h1>
		);
	}

	return (
		<>
			{loading && <Spinner loading={loading} />}
			{!loading && report && (
				<>
					<ReportHeaderImage image={report.images[0]} />
					<section>
						<div className="container m-auto py-6 px-6">
							<Link
								href="/reports"
								className="text-blue-500 hover:text-blue-600 flex items-center"
							>
								<FaArrowLeft className="mr-2" /> Back to Reports
							</Link>
						</div>
					</section>
					<section className="bg-blue-50">
						<div className="container m-auto py-10 px-6">
							<div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
								<ReportDetails report={report} />

								<aside className="space-y-4">
									<BookmarkButton report={report} />
									<ShareButtons report={report} />
									<ReportContactForm report={report} />
								</aside>
							</div>
						</div>
					</section>
					<ReportImages images={report.images} />
				</>
			)}
		</>
	);
};
export default ReportPage;
