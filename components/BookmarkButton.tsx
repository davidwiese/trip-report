"use client";
import { useState, useEffect } from "react";
import { FaBookmark } from "react-icons/fa";
import { Report as ReportType } from "@/types";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import checkBookmarkStatus from "@/app/actions/checkBookmarkStatus";
import bookmarkReport from "@/app/actions/bookmarkReport";

type BookmarkButtonProps = {
	report: ReportType;
};

type SessionUser = {
	id?: string;
	name?: string | null;
	email?: string | null;
	image?: string | null;
};

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ report }) => {
	const { data: session } = useSession();
	const userId = (session?.user as SessionUser)?.id;

	const [isBookmarked, setIsBookmarked] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!userId) {
			setLoading(false);
			return;
		}

		// NOTE: here we can use a server action to check the bookmark status for a
		// specific use for the report
		checkBookmarkStatus(report._id).then((res) => {
			if (res.error) toast.error(res.error);
			if (res.isBookmarked) setIsBookmarked(res.isBookmarked);
			setLoading(false);
		});
	}, [report._id, userId]);

	const handleClick = async () => {
		if (!userId) {
			toast.error("Must be logged in to bookmark a report");
			return;
		}

		// NOTE: here we can use a server action to mark bookmark a report for the
		// user
		bookmarkReport(report._id).then((res) => {
			if (res.error) return toast.error(res.error);
			setIsBookmarked(res.isBookmarked);
			toast.success(res.message);
		});
	};

	if (loading) {
		return (
			<button className="bg-gray-500 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center">
				<FaBookmark className="mr-2" /> Loading...
			</button>
		);
	}

	return isBookmarked ? (
		<button
			onClick={handleClick}
			className="bg-red-500 hover:bg-red-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
		>
			<FaBookmark className="mr-2" /> Remove Bookmark
		</button>
	) : (
		<button
			onClick={handleClick}
			className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
		>
			<FaBookmark className="mr-2" /> Bookmark Report
		</button>
	);
};
export default BookmarkButton;
