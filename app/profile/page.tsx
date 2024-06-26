import ProfileReportCard from "@/components/ProfileReportCard";
import connectDB from "@/config/database";
import { getSessionUser } from "@/utils/getSessionUser";
import User from "@/models/User";
import Report from "@/models/Report";
import { convertToSerializableObject } from "@/utils/convertToObject";
import { Report as ReportType, User as UserType } from "@/types";
import UserStatsCard from "@/components/UserStatsCard";

async function loader() {
	await connectDB();
	const sessionUser = await getSessionUser();

	if (!sessionUser || !sessionUser.userId) {
		return {
			reports: [],
			user: null,
		};
	}

	const userDoc = await User.findById(sessionUser.userId).lean();
	const user = userDoc
		? (convertToSerializableObject(userDoc) as UserType)
		: null;

	if (!user) {
		return {
			reports: [],
			user: null,
		};
	}

	const reportsDocs = await Report.find({ owner: sessionUser.userId }).lean();
	const reports = reportsDocs.map(convertToSerializableObject) as ReportType[];

	return {
		reports,
		user,
	};
}

const ProfilePage: React.FC = async () => {
	const { reports, user } = await loader();

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
							<ProfileReportCard reports={reports} />
						)}
					</div>
				</div>
			</section>
		</>
	);
};

export default ProfilePage;
