import Image from "next/image";
import { notFound } from "next/navigation";
import profileDefault from "@/assets/images/profile.png";
import PublicProfileReports from "@/components/PublicProfileReports";
import connectDB from "@/config/database";
import User from "@/models/User";
import Report from "@/models/Report";
import { convertToSerializableObject } from "@/utils/convertToObject";
import { Report as ReportType, User as UserType } from "@/types";

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
		<section className="bg-blue-50">
			<div className="container m-auto py-24">
				<div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
					<h1 className="text-3xl font-bold mb-4">
						{user.username}&apos;s Profile
					</h1>
					<div className="flex flex-col md:flex-row">
						<div className="md:w-1/4 mx-20 mt-10">
							<div className="mb-4">
								<Image
									className="h-32 w-32 md:h-48 md:w-48 rounded-full mx-auto md:mx-0"
									src={user.image || profileDefault}
									alt="User"
									width={200}
									height={200}
								/>
							</div>
							<h2 className="text-2xl mb-4">
								<span className="font-bold block">Name: </span> {user.username}
							</h2>
							<h2 className="text-2xl">
								<span className="font-bold block">Email: </span> {user.email}
							</h2>
						</div>

						<div className="md:w-3/4 md:pl-4">
							<h2 className="text-xl font-semibold mb-4">
								{user.username}&apos;s Reports
							</h2>
							{reports.length === 0 ? (
								<p>{user.username} has no trip reports</p>
							) : (
								<PublicProfileReports reports={reports} />
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default PublicProfilePage;
