import { Report } from "@/types";
import Image from "next/image";
import Link from "next/link";
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
import { Badge } from "@/components/ui/badge";
import { montserrat } from "@/app/ui/fonts";

type ReportCardProps = {
	report: Report;
};

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
	const placeholderImage = "/images/placeholder-image.png";
	const thumbnailImage =
		report.images && report.images.length > 0
			? report.images[0].url
			: placeholderImage;

	return (
		<Card className="bg-white rounded-xl shadow-md relative z-20 flex flex-col h-full  min-w-[288px]">
			<div className="relative h-48 w-full">
				<Image
					src={thumbnailImage}
					alt={report.title}
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					style={{ objectFit: "cover", objectPosition: "center" }}
					className="rounded-t-xl"
					priority
				/>
			</div>
			<div className="flex flex-col flex-grow p-1">
				<CardHeader>
					<CardTitle
						className={`text-xl font-bold ${montserrat.className} line-clamp-1`}
					>
						{report.title}
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
					{report.description && (
						<p
							className="text-sm text-gray-700 line-clamp-3 mb-6"
							style={{
								whiteSpace: "pre-wrap",
								wordWrap: "break-word",
								overflowWrap: "break-word",
							}}
						>
							{report.description}
						</p>
					)}
					<div className="flex flex-wrap gap-1">
						{report.activityType.map((type) => (
							<Badge key={type} variant="outline" className="">
								{type}
							</Badge>
						))}
					</div>
				</CardContent>
				<div className="flex-grow" />
				<CardFooter className="mt-4 flex justify-between items-center pt-4">
					<Button asChild variant="outline">
						<Link href={`/profile/${report.owner}`}>View Profile</Link>
					</Button>
					<Button asChild className="z-30">
						<Link href={`/reports/${report._id}`} className="cursor-pointer">
							Report Details
						</Link>
					</Button>
				</CardFooter>
			</div>
		</Card>
	);
};

export default ReportCard;
