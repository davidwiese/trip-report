import BookmarkReportCard from "@/components/BookmarkReportCard";
import Pagination from "@/components/Pagination";
import connectDB from "@/config/database";
import User from "@/models/User";
import { Report as ReportType, User as UserType } from "@/types";
import { convertToSerializableObject } from "@/utils/convertToObject";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

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

export const metadata: Metadata = {
	title: "Bookmarks",
	alternates: {
		canonical: "https://www.tripreport.co/reports/bookmarks",
	},
	description: "View and manage your bookmarked trip reports.",
	robots: { index: false, follow: false }, // Since this is a private page
};

const BookmarkedReportsPage: React.FC<BookmarkedReportsPageProps> = async ({
	searchParams: { pageSize = "6", page = "1" },
}) => {
	await connectDB();

	const { userId: clerkUserId } = auth();

	if (!clerkUserId) {
		return (
			<section className="bg-white min-h-screen flex flex-col dark:bg-black dark:bg-gradient-to-b dark:from-[#191919] dark:via-black dark:to-[#191919]">
				<div className="container mx-auto py-12 max-w-6xl">
					<div className="bg-white dark:bg-gray-800 px-6 py-8 mb-4 shadow-md rounded-md border dark:border-gray-700 m-4 md:m-0">
						<h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
							Bookmarked Reports
						</h1>
						<p className="text-gray-700 dark:text-gray-300">
							Must be logged in to view bookmarked reports
						</p>
					</div>
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
		<section className="bg-white min-h-screen flex flex-col dark:bg-black dark:bg-gradient-to-b dark:from-[#191919] dark:via-black dark:to-[#191919]">
			<div className="container mx-auto py-12 max-w-6xl">
				<h1 className="text-2xl text-center mb-4 dark:text-white">
					Bookmarked Reports
				</h1>
				{serializableResult.bookmarkedReports.length === 0 ? (
					<p className="dark:text-white">No bookmarked reports</p>
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
