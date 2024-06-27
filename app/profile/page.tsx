import ProfileReportCard from "@/components/ProfileReportCard";
import connectDB from "@/config/database";
import { getSessionUser } from "@/utils/getSessionUser";
import User from "@/models/User";
import Report from "@/models/Report";
import { convertToSerializableObject } from "@/utils/convertToObject";
import { Report as ReportType, User as UserType } from "@/types";
import UserStatsCard from "@/components/UserStatsCard";
import Pagination from "@/components/Pagination";

async function loader(pageSize: number, page: number) {
	await connectDB();
	const sessionUser = await getSessionUser();

	if (!sessionUser || !sessionUser.userId) {
		return {
			reports: [],
			user: null,
			totalReports: 0,
		};
	}

	const { userId } = sessionUser;
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

type ProfilePageProps = {
	searchParams: {
		pageSize?: string;
		page?: string;
	};
};

const ProfilePage: React.FC<ProfilePageProps> = async ({
	searchParams: { pageSize = "4", page = "1" },
}) => {
	const validPage = parseInt(page, 10) || 1;
	const validPageSize = parseInt(pageSize, 10) || 6;

	const { reports, user, totalReports } = await loader(
		validPageSize,
		validPage
	);

	if (!user) {
		return <p>You must be logged in to view this page.</p>;
	}

	return (
		<>
			<section className="bg-white py-10">
				<div className="container mx-auto px-6">
					<UserStatsCard user={user} />
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
					<Pagination
						page={validPage}
						pageSize={validPageSize}
						totalItems={totalReports}
						basePath="/profile"
					/>
				</div>
			</section>
		</>
	);
};

export default ProfilePage;
