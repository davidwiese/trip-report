import ReportSearchForm from "@/components/ReportSearchForm";
import Reports from "@/components/Reports";
import connectDB from "@/config/database";
import Report from "@/models/Report";
import { Report as ReportType } from "@/types";
import { convertToSerializableObject } from "@/utils/convertToObject";

type ReportsPageProps = {
	searchParams: {
		pageSize?: string;
		page?: string;
	};
};

async function fetchReports(page: number, pageSize: number) {
	await connectDB();

	const totalReports = await Report.countDocuments({});
	const totalPages = Math.ceil(totalReports / pageSize);

	let currentPage = page;
	if (currentPage < 1 || currentPage > totalPages) {
		currentPage = 1;
	}

	const skip = (currentPage - 1) * pageSize;
	const reports = (await Report.find({})
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(pageSize)
		.lean()) as ReportType[];

	// Convert the reports to serializable objects
	const serializedReports = convertToSerializableObject<ReportType[]>(reports);

	return {
		reports: serializedReports,
		total: totalReports,
		currentPage,
		itemsPerPage: pageSize,
	};
}

const ReportsPage: React.FC<ReportsPageProps> = async ({
	searchParams: { pageSize = "6", page = "1" },
}) => {
	const validPage = parseInt(page, 10) || 1;
	const validPageSize = parseInt(pageSize, 10) || 6;

	const { reports, total, currentPage, itemsPerPage } = await fetchReports(
		validPage,
		validPageSize
	);

	return (
		<>
			<section className="bg-black text-white py-4">
				<div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
					<ReportSearchForm />
				</div>
			</section>
			<Reports
				reports={reports}
				total={total}
				currentPage={currentPage}
				pageSize={itemsPerPage}
			/>
		</>
	);
};

export default ReportsPage;
