import Image from "next/image";
import profileDefault from "@/assets/images/profile.png";
import ProfileReports from "@/components/ProfileReports";
import connectDB from "@/config/database";
import { getSessionUser } from "@/utils/getSessionUser";
import { convertToSerializableObject } from "@/utils/convertToObject";
import Report from "@/models/Report";
import { Report as ReportType } from "@/types";

type ProfilePageProps = {
	reports: ReportType[];
	sessionUser: {
		userId: string;
		user: {
			name?: string | null;
			email?: string | null;
			image?: string | null;
		};
	} | null;
};

async function loader(): Promise<ProfilePageProps> {
	await connectDB();
	const sessionUser = await getSessionUser();

	if (!sessionUser || !sessionUser.userId) {
		return {
			reports: [],
			sessionUser: null,
		};
	}

	const { userId } = sessionUser;

	const reportsDocs = await Report.find({ owner: userId }).lean();
	const reports = reportsDocs.map(convertToSerializableObject) as ReportType[];

	return {
		reports,
		sessionUser,
	};
}

const ProfilePage: React.FC<ProfilePageProps> = async () => {
	const { reports, sessionUser } = await loader();

	if (!sessionUser) {
		return <p>You must be logged in to view this page.</p>;
	}

	return (
		<section className="bg-blue-50">
			<div className="container m-auto py-24">
				<div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
					<h1 className="text-3xl font-bold mb-4">Your Profile</h1>
					<div className="flex flex-col md:flex-row">
						<div className="md:w-1/4 mx-20 mt-10">
							<div className="mb-4">
								<Image
									className="h-32 w-32 md:h-48 md:w-48 rounded-full mx-auto md:mx-0"
									src={sessionUser.user.image || profileDefault}
									alt="User"
									width={200}
									height={200}
								/>
							</div>
							<h2 className="text-2xl mb-4">
								<span className="font-bold block">Name: </span>{" "}
								{sessionUser.user.name}
							</h2>
							<h2 className="text-2xl">
								<span className="font-bold block">Email: </span>{" "}
								{sessionUser.user.email}
							</h2>
						</div>

						<div className="md:w-3/4 md:pl-4">
							<h2 className="text-xl font-semibold mb-4">Your Reports</h2>
							{reports.length === 0 ? (
								<p>You have no trip reports</p>
							) : (
								<ProfileReports reports={reports} />
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ProfilePage;
