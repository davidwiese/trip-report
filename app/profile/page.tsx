import Pagination from "@/components/Pagination";
import ProfileReportCard from "@/components/ProfileReportCard";
import UserStatsCard from "@/components/UserStatsCard";
import connectDB from "@/config/database";
import Report from "@/models/Report";
import { Report as ReportType, User as UserType } from "@/types";
import { convertToSerializableObject } from "@/utils/convertToObject";
import { findUserByClerkId } from "@/utils/userUtils";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

async function loader(pageSize: number, page: number, clerkUserId: string) {
	await connectDB();

	const user = await findUserByClerkId(clerkUserId);

	if (!user) {
		return {
			reports: [],
			user: null,
			totalReports: 0,
			currentPage: 1,
		};
	}

	const totalReports = await Report.countDocuments({ owner: user._id });
	const totalPages = Math.ceil(totalReports / pageSize);

	let currentPage = page;
	if (currentPage < 1 || currentPage > totalPages) {
		currentPage = 1;
	}

	const skip = (currentPage - 1) * pageSize;
	const reportsDocs = await Report.find({ owner: user._id })
		.skip(skip)
		.limit(pageSize)
		.lean();
	const reports = reportsDocs.map(convertToSerializableObject) as ReportType[];

	return {
		reports,
		user: convertToSerializableObject(user) as UserType,
		totalReports,
		currentPage,
	};
}

type ProfilePageProps = {
	searchParams: {
		pageSize?: string;
		page?: string;
	};
};

export const metadata: Metadata = {
	title: "Profile",
	description:
		"View and manage your Trip Report profile, including your trip reports and statistics.",
	robots: { index: false, follow: false }, // Since this is a private page
};

const ProfilePage: React.FC<ProfilePageProps> = async ({
	searchParams: { pageSize = "4", page = "1" },
}) => {
	const { userId: clerkUserId } = auth();

	if (!clerkUserId) {
		return <p>You must be logged in to view this page.</p>;
	}

	const validPage = parseInt(page, 10) || 1;
	const validPageSize = parseInt(pageSize, 10) || 6;

	const { reports, user, totalReports, currentPage } = await loader(
		validPageSize,
		validPage,
		clerkUserId
	);

	if (!user) {
		return <p>User not found.</p>;
	}

	const isOwnProfile = true;

	return (
		<>
			<section className="bg-white py-10">
				<div className="container mx-auto px-6">
					<UserStatsCard user={user} isOwnProfile={isOwnProfile} />
				</div>
			</section>
			<section className="bg-white py-10">
				<div className="container mx-auto px-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{reports.length === 0 ? (
							<p className="text-center text-gray-600">
								You have no trip reports
							</p>
						) : (
							reports.map((report) => (
								<ProfileReportCard key={report._id} report={report} />
							))
						)}
					</div>
					{totalReports > 0 && (
						<Pagination
							page={currentPage}
							pageSize={validPageSize}
							totalItems={totalReports}
							basePath="/profile"
						/>
					)}
				</div>
			</section>
		</>
	);
};

export default ProfilePage;
