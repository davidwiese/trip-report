import Pagination from "@/components/Pagination";
import ReportCard from "@/components/ReportCard";
import { Report } from "@/types";

type ReportsProps = {
	reports: Report[];
	total: number;
	currentPage: number;
	pageSize: number;
};

const Reports: React.FC<ReportsProps> = ({
	reports,
	total,
	currentPage,
	pageSize,
}) => {
	return (
		<section className="px-4 py-6 -mb-[2px] dark:bg-black dark:bg-gradient-to-b dark:from-black dark:via-black dark:to-[#191919]">
			<div className="container-xl lg:container m-auto px-4 py-6">
				{reports.length === 0 ? (
					<p>No reports found</p>
				) : (
					<div className="grid grid-cols-1 custom-lg:grid-cols-3 gap-6">
						{reports.map((report) => (
							<ReportCard key={report._id} report={report} />
						))}
					</div>
				)}
				{total > 0 && (
					<Pagination
						page={currentPage}
						pageSize={pageSize}
						totalItems={total}
						basePath="/reports"
					/>
				)}
			</div>
		</section>
	);
};
export default Reports;
