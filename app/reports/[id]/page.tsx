import Link from "next/link";
import ReportHeaderImage from "@/components/ReportHeaderImage";
import ReportDetails from "@/components/ReportDetails";
import ReportImages from "@/components/ReportImages";
import BookmarkButton from "@/components/BookmarkButton";
import ReportContactForm from "@/components/ReportContactForm";
import ShareButtons from "@/components/ShareButtons";
import { FaArrowLeft } from "react-icons/fa";
import connectDB from "@/config/database";
import Report from "@/models/Report";
import { convertToSerializableObject } from "@/utils/convertToObject";
import { Report as ReportType } from "@/types";

type ReportPageProps = {
	params: {
		id: string;
	};
};

const ReportPage: React.FC<ReportPageProps> = async ({ params }) => {
	// NOTE: here we can check if we are running in in production on vercel and get
	// the public URL at build time for the ShareButtons, or fall back to localhost in development.

	const PUBLIC_DOMAIN = process.env.VERCEL_URL
		? `https://${process.env.VERCEL_URL}`
		: "http://localhost:3000";

	await connectDB();

	// Query the report in the DB
	const reportDoc = await Report.findById(params.id).lean();

	// Null check
	if (!reportDoc) {
		return (
			<h1 className="text-center text-2xl font-bold mt-10">Report Not Found</h1>
		);
	}

	// Convert the document to a plain js object so we can pass to client
	// components
	const report = convertToSerializableObject(reportDoc) as ReportType;

	if (!report) {
		return (
			<h1 className="text-center text-2xl font-bold mt-10">Report Not Found</h1>
		);
	}

	return (
		<>
			<ReportHeaderImage image={report.images[0]} />
			<section>
				<div className="container m-auto py-6 px-6">
					<Link
						href="/reports"
						className="text-blue-500 hover:text-blue-600 flex items-center"
					>
						<FaArrowLeft className="mr-2" /> Back to Reports
					</Link>
				</div>
			</section>
			<section className="bg-blue-50">
				<div className="container m-auto py-10 px-6">
					<div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
						<ReportDetails report={report} />

						<aside className="space-y-4">
							<BookmarkButton report={report} />
							<ShareButtons report={report} PUBLIC_DOMAIN={PUBLIC_DOMAIN} />
							<ReportContactForm report={report} />
						</aside>
					</div>
				</div>
			</section>
			<ReportImages images={report.images} />
		</>
	);
};
export default ReportPage;
