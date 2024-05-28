import FeaturedReportCard from "@/components/FeaturedReportCard";
import connectDB from "@/config/database";
import { Report as ReportType } from "@/types";
import Report from "@/models/Report";

type FeaturedReportsProps = {
	// Add any props here if needed
};

const FeaturedReports: React.FC<FeaturedReportsProps> = async () => {
	await connectDB();

	const reports: ReportType[] = await Report.find({
		isFeatured: true,
	}).lean();

	return reports.length > 0 ? (
		<section className="bg-blue-50 px-4 pt-6 pb-10">
			<div className="container-xl lg:container m-auto">
				<h2 className="text-3xl font-bold text-gray-500 mb-6 text-center">
					Featured Reports
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{reports.map((report: ReportType) => (
						<FeaturedReportCard key={report._id} report={report} />
					))}
				</div>
			</div>
		</section>
	) : null;
};

export default FeaturedReports;
