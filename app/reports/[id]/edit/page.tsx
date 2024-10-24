import ReportEditForm from "@/components/ReportEditForm";
import connectDB from "@/config/database";
import Report from "@/models/Report";
import User from "@/models/User";
import { Report as ReportType } from "@/types";
import { convertToSerializableObject } from "@/utils/convertToObject";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Types } from "mongoose";

type ReportEditPageProps = {
	params: {
		id: string;
	};
};

// Define a type for the lean document
type LeanReport = {
	_id: Types.ObjectId;
	owner: Types.ObjectId;
	title: string;
	activityType: string[];
	description: string;
	body: string;
	location: {
		country: string;
		region: string;
		localArea: string;
		objective: string;
	};
	distance: number;
	elevationGain: number;
	elevationLoss: number;
	duration: number;
	gpxFile?: {
		url: string;
		originalFilename: string;
	};
	caltopoUrl?: string;
	startDate: Date;
	endDate: Date;
	images?: {
		url: string;
		originalFilename: string;
	}[];
	isFeatured: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export async function generateMetadata({
	params,
}: ReportEditPageProps): Promise<Metadata> {
	await connectDB();
	const report = (await Report.findById(params.id).lean()) as ReportType | null;

	if (!report) {
		return {
			title: "Report Not Found",
		};
	}

	return {
		title: `Edit: ${report.title}`,
		description: `Edit your trip report for ${report.title}`,
		robots: { index: false, follow: false },
	};
}

const ReportEditPage: React.FC<ReportEditPageProps> = async ({ params }) => {
	const { userId: clerkUserId } = auth();

	// If not logged in, redirect to login
	if (!clerkUserId) {
		redirect("/auth/signin");
	}

	await connectDB();

	// Get the current user
	const user = await User.findOne({ clerkId: clerkUserId });
	if (!user) {
		redirect("/auth/signin");
	}

	// Validate report ID format
	if (!Types.ObjectId.isValid(params.id)) {
		return (
			<h1 className="text-center text-2xl font-bold mt-10">
				Invalid Report ID
			</h1>
		);
	}

	// Query the report in the DB with explicit typing
	const reportDoc = (await Report.findById(
		params.id
	).lean()) as LeanReport | null;

	if (!reportDoc) {
		return (
			<h1 className="text-center text-2xl font-bold mt-10">Report Not Found</h1>
		);
	}

	// Check if the current user is the author
	if (reportDoc.owner.toString() !== user._id.toString()) {
		redirect(`/reports/${params.id}`);
	}

	// Convert doc to client-safe type with string IDs
	const report: ReportType = {
		...reportDoc,
		_id: reportDoc._id.toString(),
		owner: reportDoc.owner.toString(),
		startDate: reportDoc.startDate.toISOString(),
		endDate: reportDoc.endDate.toISOString(),
		createdAt: reportDoc.createdAt.toISOString(),
		updatedAt: reportDoc.updatedAt.toISOString(),
	};

	if (!report) {
		return (
			<h1 className="text-center text-2xl font-bold mt-10">Report Not Found</h1>
		);
	}

	return (
		<section className="bg-white dark:bg-black dark:bg-gradient-to-b dark:from-[#191919] dark:via-black dark:to-[#191919]">
			<div className="w-full px-4 m-auto max-w-2xl py-12">
				<div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
					<ReportEditForm report={report} />
				</div>
			</div>
		</section>
	);
};
export default ReportEditPage;
