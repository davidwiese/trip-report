import ReportCard from "@/components/ReportCard";
import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
import { Report as ReportType, User as UserType } from "@/types";

type SavedReportsPageProps = {
	// Add any props here if needed
};

const SavedReportsPage: React.FC<SavedReportsPageProps> = async () => {
	await connectDB();

	require("@/models/Report");

	const sessionUser = await getSessionUser();

	if (!sessionUser || !sessionUser.userId) {
		return (
			<section className="px-4 py-6">
				<h1 className="text-2xl mb-4">Saved Reports</h1>
				<div className="container-xl lg:container m-auto px-4 py-6">
					<p>Must be logged in to view saved reports</p>
				</div>
			</section>
		);
	}

	const { userId } = sessionUser;

	const user: UserType | null = await User.findById(userId)
		.populate("bookmarks")
		.lean();

	if (!user || !user.bookmarks) {
		return (
			<section className="px-4 py-6">
				<h1 className="text-2xl mb-4">Saved Reports</h1>
				<div className="container-xl lg:container m-auto px-4 py-6">
					<p>No saved reports</p>
				</div>
			</section>
		);
	}

	const savedReports: ReportType[] = user.bookmarks;

	return (
		<section className="px-4 py-6">
			<h1 className="text-2xl mb-4">Saved Reports</h1>
			<div className="container-xl lg:container m-auto px-4 py-6">
				{savedReports.length === 0 ? (
					<p>No saved reports</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{savedReports.map((report: ReportType) => (
							<ReportCard key={report._id} report={report} />
						))}
					</div>
				)}
			</div>
		</section>
	);
};
export default SavedReportsPage;
