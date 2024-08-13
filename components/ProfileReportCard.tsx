"use client";

import Image from "next/image";
import Link from "next/link";
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
import { montserrat } from "@/app/ui/fonts";
import EditButton from "@/components/EditButton";
import DeleteButton from "@/components/DeleteButton";

type ProfileReportCardProps = {
	report: ReportType;
};

const ProfileReportCard: React.FC<ProfileReportCardProps> = ({ report }) => {
	const placeholderImage = "/images/placeholder-image.png";

	return (
		<Card className="bg-white rounded-xl shadow-md relative z-20 flex flex-col h-full min-w-[288px] mb-10">
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
							<span>Elevation Gain: {report.elevationGain.toFixed(0)} ft</span>
						</p>
						<p className="flex items-center gap-1">
							<LuMoveDownRight className="text-xl mr-2" />
							<span>Elevation Loss: {report.elevationLoss.toFixed(0)} ft</span>
						</p>
					</div>
				</CardContent>
				<div className="flex-grow" />
				<CardFooter className="flex justify-between items-center">
					<EditButton report={report} />
					<DeleteButton report={report} />
				</CardFooter>
			</div>
		</Card>
	);
};

export default ProfileReportCard;
