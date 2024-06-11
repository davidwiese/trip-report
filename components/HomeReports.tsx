import Link from "next/link";
import ReportCard from "@/components/ReportCard";
import connectDB from "@/config/database";
import { Report as ReportType } from "@/types";
import Report from "@/models/Report";
import { Button } from "@/components/ui/button";
import { SparklesCore } from "@/components/ui/sparkles";

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
			<div className="relative bg-gradient-to-b from-white via-blue-100 to-white -z-10">
				<div className="absolute inset-0 w-full h-full -z-10">
					<SparklesCore
						background="transparent"
						minSize={0.3}
						maxSize={1.1}
						particleDensity={45}
						className="w-full h-full"
						particleColor="#000000"
						speed={1}
					/>
				</div>
				<section className="px-4 py-6 mt-4">
					<div className="container-xl lg:container m-auto">
						<h2 className="text-4xl font-bold text-black mb-8 text-center">
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
					<Button asChild className="w-full">
						<Link href="/reports">View All Reports</Link>
					</Button>
				</section>
			</div>
		</>
	);
};
export default HomeReports;
