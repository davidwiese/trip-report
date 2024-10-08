import Pagination from "@/components/Pagination";
import ProfileContactForm from "@/components/ProfileContactForm";
import PublicProfileReportCard from "@/components/PublicProfileReportCard";
import UserStatsCard from "@/components/UserStatsCard";
import connectDB from "@/config/database";
import Report from "@/models/Report";
import User from "@/models/User";
import { Report as ReportType, User as UserType } from "@/types";
import { convertToSerializableObject } from "@/utils/convertToObject";
import { findUserByClerkId } from "@/utils/userUtils";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type PublicProfilePageProps = {
	params: {
		id: string;
	};
	searchParams: {
		pageSize?: string;
		page?: string;
	};
};

async function getProfileUser(userId: string): Promise<UserType | null> {
	await connectDB();
	const user = await User.findById(userId).lean();
	return user ? (convertToSerializableObject(user) as UserType) : null;
}

async function loader(userId: string, pageSize: number, page: number) {
	const user = await getProfileUser(userId);

	if (!user) {
		return null;
	}

	const totalReports = await Report.countDocuments({ owner: userId });
	const totalPages = Math.ceil(totalReports / pageSize);

	let currentPage = page;
	if (currentPage < 1 || currentPage > totalPages) {
		currentPage = 1;
	}

	const skip = (currentPage - 1) * pageSize;
	const reportsDocs = await Report.find({ owner: user._id })
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(pageSize)
		.lean();
	const reports = reportsDocs.map(convertToSerializableObject) as ReportType[];

	return {
		reports,
		user,
		totalReports,
		currentPage,
	};
}

export async function generateMetadata({
	params,
}: PublicProfilePageProps): Promise<Metadata> {
	const user = await getProfileUser(params.id);

	if (!user) {
		return {
			title: "User Not Found | Trip Report",
			description: "The requested user profile could not be found.",
		};
	}

	return {
		title: `${user.username}'s Profile`,
		description: `Check out ${user.username}'s trip reports and outdoor adventures on Trip Report.`,
		openGraph: {
			title: `${user.username} on Trip Report`,
			description: `View ${user.username}'s outdoor adventures and trip reports.`,
			type: "profile",
		},
	};
}

const PublicProfilePage: React.FC<PublicProfilePageProps> = async ({
	params,
	searchParams: { pageSize = "4", page = "1" },
}) => {
	const validPage = parseInt(page, 10) || 1;
	const validPageSize = parseInt(pageSize, 10) || 6;

	const loaderResult = await loader(params.id, validPageSize, validPage);

	if (!loaderResult) {
		notFound();
		return null;
	}

	const { reports, user, totalReports, currentPage } = loaderResult;

	const { userId: currentUserClerkId } = auth();
	let currentUser = null;
	let isOwnProfile = false;

	if (currentUserClerkId) {
		currentUser = await findUserByClerkId(currentUserClerkId);
		isOwnProfile = currentUser?._id.toString() === params.id;
	}

	return (
		<>
			<section className="bg-white py-10 dark:bg-black dark:bg-gradient-to-b dark:from-[#191919] dark:via-black dark:to-black">
				<div className="container mx-auto px-6">
					<UserStatsCard user={user} isOwnProfile={isOwnProfile} />
				</div>
			</section>
			<section className="bg-white py-10 dark:bg-black dark:bg-gradient-to-b dark:from-black dark:via-black dark:to-[#191919]">
				<div className="container mx-auto px-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{reports.length === 0 ? (
							<p className="text-center text-gray-600">
								{user.username} has no trip reports
							</p>
						) : (
							reports.map((report) => (
								<PublicProfileReportCard key={report._id} report={report} />
							))
						)}
					</div>
					{totalReports > 0 && (
						<Pagination
							page={currentPage}
							pageSize={validPageSize}
							totalItems={totalReports}
							basePath={`/profile/${params.id}`}
						/>
					)}
				</div>
			</section>

			{!isOwnProfile && currentUser && user && user._id && (
				<section className="bg-white py-10 dark:bg-black dark:bg-gradient-to-b dark:from-[#191919] dark:via-black dark:to-[#191919]">
					<div className="container mx-auto px-6">
						<ProfileContactForm recipientId={user._id.toString()} />
					</div>
				</section>
			)}
		</>
	);
};

export default PublicProfilePage;
