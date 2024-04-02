"use client";
import { useState, useEffect } from "react";
import { FaBookmark } from "react-icons/fa";
import { Report } from "@/types";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

type BookmarkButtonProps = {
	report: Report;
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
		const checkBookmarkStatus = async () => {
			if (!userId) {
				setLoading(false);
				return;
			}

			try {
				const res = await fetch("/api/bookmarks/check", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						reportId: report._id,
					}),
				});

				if (res.status === 200) {
					const data = await res.json();
					setIsBookmarked(data.isBookmarked);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};

		checkBookmarkStatus();
	}, [report._id, userId]);

	const handleClick = async () => {
		if (!userId) {
			toast.error("Must be logged in to bookmark a report");
			return;
		}

		try {
			const res = await fetch("/api/bookmarks", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					reportId: report._id,
				}),
			});

			if (res.status === 200) {
				const data = await res.json();
				toast.success(data.message);
				setIsBookmarked(data.isBookmarked);
			}
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong");
		}
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
