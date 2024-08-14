import ReportEditForm from "@/components/ReportEditForm";
import connectDB from "@/config/database";
import Report from "@/models/Report";
import { Report as ReportType } from "@/types";
import { convertToSerializableObject } from "@/utils/convertToObject";

type ReportEditPageProps = {
	params: {
		id: string;
	};
};

const ReportEditPage: React.FC<ReportEditPageProps> = async ({ params }) => {
	await connectDB();

	// Query the report in the DB
	const reportDoc = await Report.findById(params.id).lean();

	if (!reportDoc) {
		return (
			<h1 className="text-center text-2xl font-bold mt-10">Report Not Found</h1>
		);
	}

	// Convert doc to plain js object so we can pass to client component
	const report = convertToSerializableObject(reportDoc) as ReportType;

	if (!report) {
		return (
			<h1 className="text-center text-2xl font-bold mt-10">Report Not Found</h1>
		);
	}

	return (
		<section className="bg-white">
			<div className="container m-auto max-w-2xl py-24">
				<div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
					<ReportEditForm report={report} />
				</div>
			</div>
		</section>
	);
};
export default ReportEditPage;
