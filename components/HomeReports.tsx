import { montserrat } from "@/app/ui/fonts";
import ReportCard from "@/components/ReportCard";
import { Button } from "@/components/ui/button";
import { SparklesCore } from "@/components/ui/sparkles";
import connectDB from "@/config/database";
import Report from "@/models/Report";
import { Report as ReportType } from "@/types";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

type HomeReportsProps = {};

const HomeReports: React.FC<HomeReportsProps> = async () => {
	noStore();
	await connectDB();

	const recentReports: ReportType[] = await Report.find({})
		.sort({ createdAt: -1 })
		.limit(3)
		.lean();

	return (
		<>
			<div className="relative bg-gradient-to-b from-white via-blue-100 to-white">
				<div className="absolute inset-0 w-full h-full pointer-events-none z-0">
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
				<section className="relative z-10 px-4 py-6 mt-4">
					<div className="container-xl lg:container m-auto">
						<h2
							className={`text-4xl font-bold text-black mb-8 text-center ${montserrat.className}`}
						>
							Recent Reports
						</h2>
						<div className="grid grid-cols-1 custom-md:grid-cols-3 gap-4">
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
				<section className="relative z-10 m-auto max-w-lg my-10 px-6">
					<Button asChild className="w-full">
						<Link href="/reports">View All Reports</Link>
					</Button>
				</section>
			</div>
		</>
	);
};
export default HomeReports;
