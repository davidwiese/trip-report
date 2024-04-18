import Link from "next/link";
import ReportCard from "@/components/ReportCard";
import connectDB from "@/config/database";
import { Report as ReportType } from "@/types";
import Report from "@/models/Report";

type HomeReportsProps = {
	// Add any props here if needed
};

const HomeReports: React.FC<HomeReportsProps> = async () => {
	await connectDB();

	const recentReports: ReportType[] = await Report.find({})
		.sort({ createdAt: -1 })
		.limit(3)
		.lean();

	return (
		<>
			<section className="px-4 py-6">
				<div className="container-xl lg:container m-auto">
					<h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
						Recent Reports
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{recentReports.length === 0 ? (
							<p>No reports found</p>
						) : (
							recentReports.map((report: ReportType) => (
								<ReportCard key={report._id} report={report} />
							))
						)}
					</div>
				</div>
			</section>
			<section className="m-auto max-w-lg my-10 px-6">
				<Link
					href="/reports"
					className="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
				>
					View All Reports
				</Link>
			</section>
		</>
	);
};
export default HomeReports;
