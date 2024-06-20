"use client";
import { useState, useEffect } from "react";
import { Report as ReportType } from "@/types";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { LuBookmark, LuBookmarkPlus, LuBookmarkMinus } from "react-icons/lu";
import checkBookmarkStatus from "@/app/actions/checkBookmarkStatus";
import bookmarkReport from "@/app/actions/bookmarkReport";
import { Button } from "@/components/ui/bookmark-button";

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
			<Button
				variant="outline"
				className="flex items-center justify-center"
				disabled
			>
				<LuBookmark className="mr-2 text-xl" /> Loading...
			</Button>
		);
	}

	return isBookmarked ? (
		<Button
			onClick={handleClick}
			variant="default"
			className="flex items-center justify-center"
		>
			<LuBookmarkMinus className="mr-2 text-xl" /> Remove Bookmark
		</Button>
	) : (
		<Button
			onClick={handleClick}
			variant="outline"
			className="flex items-center justify-center"
		>
			<LuBookmarkPlus className="mr-2 text-xl" /> Bookmark Report
		</Button>
	);
};
export default BookmarkButton;
