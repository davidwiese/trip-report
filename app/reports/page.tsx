import Reports from "@/components/Reports";
import ReportSearchForm from "@/components/ReportSearchForm";
import Report from "@/models/Report";
import connectDB from "@/config/database";

type ReportsPageProps = {
	searchParams: {
		pageSize: string;
		page: string;
		reports: Report[];
		total: number;
	};
};

const ReportsPage: React.FC<ReportsPageProps> = async ({
	searchParams: { pageSize = "6", page = "1" },
}) => {
	await connectDB();

	const validPage = parseInt(page, 10) || 1;
	const validPageSize = parseInt(pageSize, 10) || 6;

	const skip = (validPage - 1) * validPageSize;

	const total = await Report.countDocuments({});
	const reports = await Report.find({}).skip(skip).limit(validPageSize);

	return (
		<>
			<section className="bg-blue-700 py-4">
				<div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
					<ReportSearchForm />
				</div>
			</section>
			<Reports
				reports={reports}
				total={total}
				page={validPage}
				pageSize={validPageSize}
			/>
		</>
	);
};
export default ReportsPage;
