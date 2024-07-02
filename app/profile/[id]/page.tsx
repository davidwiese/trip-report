import { notFound } from "next/navigation";
import PublicProfileReportCard from "@/components/PublicProfileReportCard";
import ProfileContactForm from "@/components/ProfileContactForm";
import connectDB from "@/config/database";
import User from "@/models/User";
import Report from "@/models/Report";
import { convertToSerializableObject } from "@/utils/convertToObject";
import { Report as ReportType, User as UserType } from "@/types";
import UserStatsCard from "@/components/UserStatsCard";
import Pagination from "@/components/Pagination";
import { getSessionUser } from "@/utils/getSessionUser";

type PublicProfilePageProps = {
	params: {
		id: string;
	};
	searchParams: {
		pageSize?: string;
		page?: string;
	};
};

async function loader(userId: string, pageSize: number, page: number) {
	await connectDB();

	const userDoc = await User.findById(userId).lean();
	const user = userDoc
		? (convertToSerializableObject(userDoc) as UserType)
		: null;

	if (!user) {
		return {
			reports: [],
			user: null,
			totalReports: 0,
		};
	}

	const skip = (page - 1) * pageSize;
	const totalReports = await Report.countDocuments({ owner: userId });
	const reportsDocs = await Report.find({ owner: userId })
		.skip(skip)
		.limit(pageSize)
		.lean();
	const reports = reportsDocs.map(convertToSerializableObject) as ReportType[];

	return {
		reports,
		user,
		totalReports,
	};
}

const PublicProfilePage: React.FC<PublicProfilePageProps> = async ({
	params,
	searchParams: { pageSize = "4", page = "1" },
}) => {
	const validPage = parseInt(page, 10) || 1;
	const validPageSize = parseInt(pageSize, 10) || 6;

	const { reports, user, totalReports } = await loader(
		params.id,
		validPageSize,
		validPage
	);

	if (!user) {
		notFound();
		return null;
	}

	const sessionUser = await getSessionUser();
	const isOwnProfile = sessionUser?.userId === params.id;

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
								{user.username} has no trip reports
							</p>
						) : (
							reports.map((report) => (
								<PublicProfileReportCard key={report._id} report={report} />
							))
						)}
					</div>
					{reports.length > 0 && (
						<Pagination
							page={validPage}
							pageSize={validPageSize}
							totalItems={totalReports}
							basePath={`/profile/${params.id}`}
						/>
					)}
				</div>
			</section>
			{!isOwnProfile && (
				<section className="bg-white py-10">
					<div className="container mx-auto px-6">
						<ProfileContactForm recipientId={user._id.toString()} />
					</div>
				</section>
			)}
		</>
	);
};

export default PublicProfilePage;
