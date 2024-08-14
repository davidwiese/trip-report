"use client";

import bookmarkReport from "@/app/actions/bookmarkReport";
import checkBookmarkStatus from "@/app/actions/checkBookmarkStatus";
import { Button } from "@/components/ui/bookmark-button";
import { Report as ReportType } from "@/types";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { LuBookmark, LuBookmarkMinus, LuBookmarkPlus } from "react-icons/lu";
import { toast } from "react-toastify";

type BookmarkButtonProps = {
	report: ReportType;
};

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ report }) => {
	const { isSignedIn, user } = useUser();
	const userId = user?.id;

	const [isBookmarked, setIsBookmarked] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!isSignedIn || !userId) {
			setLoading(false);
			return;
		}

		checkBookmarkStatus(report._id).then((res) => {
			if (res.error) toast.error(res.error);
			if (res.isBookmarked) setIsBookmarked(res.isBookmarked);
			setLoading(false);
		});
	}, [report._id, isSignedIn, userId]);

	const handleClick = async () => {
		if (!isSignedIn || !userId) {
			toast.error("Must be logged in to bookmark a report");
			return;
		}

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
				className="flex items-center justify-center w-[183px]"
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
			className="flex items-center justify-center w-[183px]"
		>
			<LuBookmarkMinus className="mr-2 text-xl" /> Remove Bookmark
		</Button>
	) : (
		<Button
			onClick={handleClick}
			variant="outline"
			className="flex items-center justify-center w-[183px]"
		>
			<LuBookmarkPlus className="mr-2 text-xl" /> Bookmark Report
		</Button>
	);
};
export default BookmarkButton;
