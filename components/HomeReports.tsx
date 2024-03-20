import Link from "next/link";
import ReportCard from "@/components/ReportCard";
import { Report } from "@/types";

type HomeReportsProps = {
	// Add any props here if needed
};

async function fetchReports() {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/reports`, {
			cache: "no-store",
		});

		if (!res.ok) {
			throw new Error("Failed to fetch data");
		}
		return res.json();
	} catch (error) {
		console.log(error);
	}
}

const HomeReports: React.FC<HomeReportsProps> = async () => {
	const reports = await fetchReports();
	const recentReports = reports
		.sort(() => Math.random() - Math.random())
		.slice(0, 3);

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
							recentReports.map((report: Report) => (
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
					View All Properties
				</Link>
			</section>
		</>
	);
};
export default HomeReports;
