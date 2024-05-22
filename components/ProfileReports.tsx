"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import deleteReport from "@/app/actions/deleteReport";
import { Report as ReportType } from "@/types";

type ProfileReportsProps = {
	reports: ReportType[];
};

const ProfileReports: React.FC<ProfileReportsProps> = ({
	reports: initialReports,
}) => {
	const [reports, setReports] = useState(initialReports);

	const handleDeleteReport = async (reportId: string) => {
		const confirmed = window.confirm(
			"Are you sure you want to delete this report?"
		);

		if (!confirmed) return;

		await deleteReport(reportId);

		toast.success("Report Deleted");

		const updatedReports = reports.filter((report) => report._id !== reportId);

		setReports(updatedReports);
	};

	return reports.map((report) => (
		<div key={report._id} className="mb-10">
			<Link href={`/reports/${report._id}`}>
				{report.images && report.images.length > 0 && (
					<Image
						className="h-32 w-full rounded-md object-cover"
						src={report.images[0].url}
						alt=""
						width={500}
						height={100}
						priority={true}
					/>
				)}
			</Link>
			<div className="mt-2">
				<Link href={`/reports/${report._id}`}>
					<p className="text-lg font-semibold hover:underline">
						{report.title}
					</p>
				</Link>
				<p className="text-gray-600">
					Address: {report.location.country} {report.location.region}
					{report.location.localArea} {report.location.objective}
				</p>
			</div>
			<div className="mt-2">
				<Link
					href={`/reports/${report._id}/edit`}
					className="bg-blue-500 text-white px-3 py-3 rounded-md mr-2 hover:bg-blue-600"
				>
					Edit
				</Link>
				<button
					onClick={() => handleDeleteReport(report._id)}
					className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
					type="button"
				>
					Delete
				</button>
			</div>
		</div>
	));
};
export default ProfileReports;
