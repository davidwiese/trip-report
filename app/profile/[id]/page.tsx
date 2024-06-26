import Image from "next/image";
import { notFound } from "next/navigation";
import profileDefault from "@/assets/images/profile.png";
import PublicProfileReportCard from "@/components/PublicProfileReportCard";
import ReportContactForm from "@/components/ReportContactForm";
import connectDB from "@/config/database";
import User from "@/models/User";
import Report from "@/models/Report";
import { convertToSerializableObject } from "@/utils/convertToObject";
import { Report as ReportType, User as UserType } from "@/types";
import UserStatsCard from "@/components/UserStatsCard";

type PublicProfilePageProps = {
	params: {
		id: string;
	};
};

async function loader(userId: string) {
	await connectDB();

	const userDoc = await User.findById(userId).lean();
	const user = userDoc
		? (convertToSerializableObject(userDoc) as UserType)
		: null;

	if (!user) {
		return {
			reports: [],
			user: null,
		};
	}

	const reportsDocs = await Report.find({ owner: userId }).lean();
	const reports = reportsDocs.map(convertToSerializableObject) as ReportType[];

	return {
		reports,
		user,
	};
}

const PublicProfilePage: React.FC<PublicProfilePageProps> = async ({
	params,
}) => {
	const { reports, user } = await loader(params.id);

	if (!user) {
		notFound();
		return null;
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
								{user.username} has no trip reports
							</p>
						) : (
							reports.map((report) => (
								<PublicProfileReportCard key={report._id} report={report} />
							))
						)}
					</div>
				</div>
			</section>
			<section className="bg-white py-10">
				<div className="container mx-auto px-6">
					<ReportContactForm recipientId={user._id.toString()} />
				</div>
			</section>
		</>
	);
};

export default PublicProfilePage;
