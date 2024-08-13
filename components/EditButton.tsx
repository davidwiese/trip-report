"use client";

import { useUser } from "@clerk/nextjs";
import { Report as ReportType, User as UserType } from "@/types";
import Link from "next/link";
import { TbEdit } from "react-icons/tb";
import { Button } from "@/components/ui/bookmark-button";

type EditButtonProps = {
	report: ReportType;
};

const EditButton: React.FC<EditButtonProps> = ({ report }) => {
	const { user } = useUser();
	const userClerkId = user?.id;

	const ownerClerkId =
		(report.owner as UserType)?.clerkId || (report.owner as UserType)?.clerkId;

	if (userClerkId !== ownerClerkId) {
		return null;
	}

	return (
		<Button
			asChild
			variant="outline"
			className="flex items-center justify-center w-[183px]"
		>
			<Link href={`/reports/${report._id}/edit`}>
				<TbEdit className="mr-2 text-xl" /> Edit Report
			</Link>
		</Button>
	);
};

export default EditButton;
