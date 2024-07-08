import ReportCard from "@/components/ReportCard";
import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
import { Report as ReportType, User as UserType } from "@/types";
import Pagination from "@/components/Pagination";

async function loader(pageSize: number, page: number) {
	await connectDB();
	const sessionUser = await getSessionUser();

	if (!sessionUser || !sessionUser.userId) {
		return {
			savedReports: [],
			totalReports: 0,
			currentPage: 1,
		};
	}

	const { userId } = sessionUser;

	const user: UserType | null = await User.findById(userId)
		.populate("bookmarks")
		.lean();

	if (!user || !user.bookmarks) {
		return {
			savedReports: [],
			totalReports: 0,
			currentPage: 1,
		};
	}

	const totalReports = user.bookmarks.length;
	const totalPages = Math.ceil(totalReports / pageSize);

	// Ensure the page is within valid range
	let currentPage = page;
	if (currentPage < 1 || currentPage > totalPages) {
		currentPage = 1;
	}

	const skip = (currentPage - 1) * pageSize;
	const savedReports: ReportType[] = user.bookmarks.slice(
		skip,
		skip + pageSize
	);

	return {
		savedReports,
		totalReports,
		currentPage,
	};
}

type SavedReportsPageProps = {
	searchParams: {
		pageSize?: string;
		page?: string;
	};
};

const SavedReportsPage: React.FC<SavedReportsPageProps> = async ({
	searchParams: { pageSize = "6", page = "1" },
}) => {
	await connectDB();

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

	const validPage = parseInt(page, 10) || 1;
	const validPageSize = parseInt(pageSize, 10) || 6;

	const { savedReports, totalReports, currentPage } = await loader(
		validPageSize,
		validPage
	);

	return (
		<section className="px-4 py-6">
			<h1 className="text-2xl text-center mb-4">Saved Reports</h1>
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
				{totalReports > 0 && (
					<Pagination
						page={currentPage}
						pageSize={validPageSize}
						totalItems={totalReports}
						basePath="/reports/saved"
					/>
				)}
			</div>
		</section>
	);
};
export default SavedReportsPage;
