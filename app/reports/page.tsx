import Reports from "@/components/Reports";
import ReportSearchForm from "@/components/ReportSearchForm";
import Report from "@/models/Report";
import connectDB from "@/config/database";
import { convertToSerializableObject } from "@/utils/convertToObject";
import { Report as ReportType } from "@/types";

type ReportsPageProps = {
	searchParams: {
		pageSize: string;
		page: string;
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
	const reports = (await Report.find({})
		.skip(skip)
		.limit(validPageSize)
		.lean()) as ReportType[];

	// Convert the reports to serializable objects
	const serializedReports = convertToSerializableObject<ReportType[]>(reports);

	return (
		<>
			<section className="bg-black text-white py-4">
				<div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
					<ReportSearchForm />
				</div>
			</section>
			<Reports
				reports={serializedReports}
				total={total}
				page={validPage}
				pageSize={validPageSize}
			/>
		</>
	);
};
export default ReportsPage;
