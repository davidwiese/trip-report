"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import deleteReport from "@/app/actions/deleteReport";
import { Report as ReportType } from "@/types";
import { LuMoveUpRight, LuMoveDownRight } from "react-icons/lu";
import { RxRulerHorizontal } from "react-icons/rx";
import { TbMap2 } from "react-icons/tb";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { montserrat } from "@/app/fonts";

type ProfileReportCardProps = {
	report: ReportType;
};

const ProfileReportCard: React.FC<ProfileReportCardProps> = ({ report }) => {
	const [reports, setReports] = useState<ReportType[]>([report]);

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

	const placeholderImage = "/images/placeholder-image.png";

	return (
		<>
			{reports.map((report) => (
				<Card
					key={report._id}
					className="bg-white rounded-xl shadow-md relative z-20 flex flex-col h-full min-w-[288px] mb-10"
				>
					<Link
						href={`/reports/${report._id}`}
						className="relative h-48 w-full block"
					>
						<Image
							src={
								report.images && report.images.length > 0
									? report.images[0].url
									: placeholderImage
							}
							alt={report.title}
							fill
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							style={{ objectFit: "cover", objectPosition: "center" }}
							className="rounded-t-xl"
							priority
						/>
					</Link>
					<div className="flex flex-col flex-grow p-1">
						<CardHeader>
							<CardTitle
								className={`text-xl font-bold ${montserrat.className} line-clamp-1`}
							>
								<Link href={`/reports/${report._id}`}>{report.title}</Link>
							</CardTitle>
						</CardHeader>
						<CardContent className="flex-grow">
							<div className="flex items-center gap-2 mb-4 text-gray-700">
								<TbMap2 className="inline-block text-2xl" />
								<span className="font-medium">
									{report.location.objective}, {report.location.region}
								</span>
							</div>
							<div className="mb-4 text-sm text-gray-700">
								<p className="flex items-center gap-1">
									<RxRulerHorizontal className="text-xl mr-2" />
									<span>Distance: {report.distance.toFixed(2)} miles</span>
								</p>
								<p className="flex items-center gap-1">
									<LuMoveUpRight className="text-xl mr-2" />
									<span>
										Elevation Gain: {report.elevationGain.toFixed(0)} ft
									</span>
								</p>
								<p className="flex items-center gap-1">
									<LuMoveDownRight className="text-xl mr-2" />
									<span>
										Elevation Loss: {report.elevationLoss.toFixed(0)} ft
									</span>
								</p>
							</div>
						</CardContent>
						<div className="flex-grow" />
						<CardFooter className="flex justify-between items-center">
							<Button asChild variant="default" className="z-30 w-full mr-2">
								<Link href={`/reports/${report._id}/edit`}>Edit</Link>
							</Button>
							<Button
								onClick={() => handleDeleteReport(report._id)}
								variant="destructive"
								className="z-30 w-full"
							>
								Delete
							</Button>
						</CardFooter>
					</div>
				</Card>
			))}
		</>
	);
};

export default ProfileReportCard;
