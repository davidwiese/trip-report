import ReportHeaderImage from "@/components/ReportHeaderImage";
import ReportDetails from "@/components/ReportDetails";
import ReportImages from "@/components/ReportImages";
import ShareButtons from "@/components/ShareButtons";
import connectDB from "@/config/database";
import Report from "@/models/Report";
import { convertToSerializableObject } from "@/utils/convertToObject";
import { Report as ReportType, User as UserType } from "@/types";
import { auth } from "@clerk/nextjs/server";

type ReportPageProps = {
	params: {
		id: string;
	};
};

const ReportPage: React.FC<ReportPageProps> = async ({ params }) => {
	try {
		const PUBLIC_DOMAIN = process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}`
			: "http://localhost:3000";

		await connectDB();

		// Query the report in the DB and populate the owner field
		const reportDoc = await Report.findById(params.id).populate("owner").lean();
		console.log("reportDoc:", JSON.stringify(reportDoc, null, 2));

		// Null check
		if (!reportDoc) {
			console.log("Report not found for ID:", params.id);
			return (
				<h1 className="text-center text-2xl font-bold mt-10">
					Report Not Found
				</h1>
			);
		}

		// Convert the document to a plain js object so we can pass to client components
		const report = convertToSerializableObject(reportDoc) as ReportType & {
			owner: UserType;
		};
		console.log("report:", JSON.stringify(report, null, 2));

		const author = {
			name: report.owner.username,
			id: report.owner.clerkId,
		};
		console.log("author:", author);

		// Get the current user from the Clerk auth
		const { userId: clerkUserId } = auth();
		console.log("clerkUserId:", clerkUserId);

		// Check if the current user is the author of the report
		const isAuthor = clerkUserId === report.owner.clerkId;
		console.log("isAuthor:", isAuthor);

		return (
			<>
				{report.images && report.images.length > 0 && (
					<ReportHeaderImage image={report.images[0]} />
				)}
				<section className="bg-white py-10">
					<div className="container mx-auto px-6">
						<div className="grid grid-cols-1 gap-6">
							<ReportDetails
								report={report}
								author={author}
								isAuthor={isAuthor}
							/>
						</div>
					</div>
				</section>
				{report.caltopoUrl && (
					<section className="mb-10">
						<div className="container mx-auto max-w-6xl px-6">
							<div className="rounded-xl shadow-xl overflow-hidden bg-gray-100">
								<iframe
									src={report.caltopoUrl}
									width="100%"
									height="500"
									style={{ border: 0 }}
									allowFullScreen
									className="rounded-xl"
								></iframe>
							</div>
						</div>
					</section>
				)}
				<section className="mb-10">
					{report.images && report.images.length > 0 && (
						<ReportImages images={report.images} />
					)}
				</section>
				<section className="mb-10">
					<ShareButtons report={report} PUBLIC_DOMAIN={PUBLIC_DOMAIN} />
				</section>
			</>
		);
	} catch (error) {
		console.error("Error in ReportPage:", error);
		return (
			<h1 className="text-center text-2xl font-bold mt-10">
				An error occurred. Please try again later.
			</h1>
		);
	}
};

export default ReportPage;
