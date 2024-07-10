"use client";

import { useSession } from "next-auth/react";
import { Report as ReportType } from "@/types";
import Link from "next/link";
import { TbEdit } from "react-icons/tb";
import { Button } from "@/components/ui/bookmark-button";

type EditButtonProps = {
	report: ReportType;
};

type SessionUser = {
	id?: string;
	name?: string | null;
	email?: string | null;
	image?: string | null;
};

const EditButton: React.FC<EditButtonProps> = ({ report }) => {
	const { data: session } = useSession();
	const userId = (session?.user as SessionUser)?.id;

	if (userId !== report.owner.toString()) {
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
