import { Report } from "@/types";
import ReportCard from "@/components/ReportCard";
import Pagination from "@/components/Pagination";

type ReportsProps = {
	reports: Report[];
	total: number;
	page: number;
	pageSize: number;
};

const Reports: React.FC<ReportsProps> = ({
	reports,
	total,
	page,
	pageSize,
}) => {
	return (
		<section className="px-4 py-6">
			<div className="container-xl lg:container m-auto px-4 py-6">
				{reports.length === 0 ? (
					<p>No reports found</p>
				) : (
					<div className="grid grid-cols-1 custom-lg:grid-cols-3 gap-6">
						{(reports as Report[]).map((report) => (
							<ReportCard key={report._id} report={report} />
						))}
					</div>
				)}
				<Pagination page={page} pageSize={pageSize} totalItems={total} />
			</div>
		</section>
	);
};
export default Reports;
