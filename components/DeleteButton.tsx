"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import deleteReport from "@/app/actions/deleteReport";
import { Report as ReportType } from "@/types";
import { Button } from "@/components/ui/button";
import { AiOutlineDelete } from "react-icons/ai";

type DeleteButtonProps = {
	report: ReportType;
};

const DeleteButton: React.FC<DeleteButtonProps> = ({ report }) => {
	const handleDeleteReport = async (reportId: string) => {
		const confirmed = window.confirm(
			"Are you sure you want to delete this report?"
		);

		if (!confirmed) return;

		await deleteReport(reportId);

		toast.success("Report Deleted");
	};

	return (
		<Button
			onClick={() => handleDeleteReport(report._id)}
			variant="destructive"
			className="flex items-center justify-center w-[183px]"
		>
			<AiOutlineDelete className="mr-2 text-xl" /> Delete Report
		</Button>
	);
};

export default DeleteButton;
