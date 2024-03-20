import ReportCard from "@/components/ReportCard";
import { Report } from "@/types";

type ReportsPageProps = {
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

const ReportsPage: React.FC<ReportsPageProps> = async () => {
	const reports = await fetchReports();

	// Sort reports by date
	reports.sort(
		(a: Report, b: Report) =>
			new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	);

	return (
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
			</div>
		</section>
	);
};
export default ReportsPage;
