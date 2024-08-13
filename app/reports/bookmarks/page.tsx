import BookmarkReportCard from "@/components/BookmarkReportCard";
import connectDB from "@/config/database";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { Report as ReportType, User as UserType } from "@/types";
import Pagination from "@/components/Pagination";
import { convertToSerializableObject } from "@/utils/convertToObject";

async function loader(pageSize: number, page: number, clerkUserId: string) {
	await connectDB();

	const user: UserType | null = await User.findOne({ clerkId: clerkUserId })
		.populate("bookmarks")
		.lean();

	if (!user || !user.bookmarks) {
		return {
			bookmarkedReports: [],
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
	const bookmarkedReports: ReportType[] = user.bookmarks
		.slice(skip, skip + pageSize)
		.map((report) => convertToSerializableObject(report));

	return {
		bookmarkedReports,
		totalReports,
		currentPage,
	};
}

type BookmarkedReportsPageProps = {
	searchParams: {
		pageSize?: string;
		page?: string;
	};
};

const BookmarkedReportsPage: React.FC<BookmarkedReportsPageProps> = async ({
	searchParams: { pageSize = "6", page = "1" },
}) => {
	await connectDB();

	const { userId: clerkUserId } = auth();

	if (!clerkUserId) {
		return (
			<section className="px-4 py-6">
				<h1 className="text-2xl mb-4">Bookmarked Reports</h1>
				<div className="container-xl lg:container m-auto px-4 py-6">
					<p>Must be logged in to view bookmarked reports</p>
				</div>
			</section>
		);
	}

	const validPage = parseInt(page, 10) || 1;
	const validPageSize = parseInt(pageSize, 10) || 6;

	const { bookmarkedReports, totalReports, currentPage } = await loader(
		validPageSize,
		validPage,
		clerkUserId
	);

	// Convert the entire result to serializable objects
	const serializableResult = convertToSerializableObject({
		bookmarkedReports,
		totalReports,
		currentPage,
	});

	return (
		<section className="px-4 py-6">
			<h1 className="text-2xl text-center mb-4">Bookmarked Reports</h1>
			<div className="container-xl lg:container m-auto px-4 py-6">
				{serializableResult.bookmarkedReports.length === 0 ? (
					<p>No bookmarked reports</p>
				) : (
					<div className="grid grid-cols-1 custom-lg:grid-cols-3 gap-6">
						{serializableResult.bookmarkedReports.map((report: ReportType) => (
							<BookmarkReportCard key={report._id} report={report} />
						))}
					</div>
				)}
				{serializableResult.totalReports > 0 && (
					<Pagination
						page={serializableResult.currentPage}
						pageSize={validPageSize}
						totalItems={serializableResult.totalReports}
						basePath="/reports/bookmarks"
					/>
				)}
			</div>
		</section>
	);
};

export default BookmarkedReportsPage;
