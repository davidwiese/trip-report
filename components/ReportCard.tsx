import { Report } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { FaMapMarker } from "react-icons/fa";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { montserrat } from "@/app/fonts";

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
		<Card className="bg-white rounded-xl shadow-md relative z-20 flex flex-col h-full">
			<div className="relative h-48 w-full">
				<Image
					src={thumbnailImage}
					alt={report.title}
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					style={{ objectFit: "cover", objectPosition: "center" }}
					className="rounded-t-xl"
				/>
			</div>
			<div className="flex flex-col flex-grow p-4">
				<CardHeader className="flex-grow">
					<CardTitle
						className={`text-xl font-bold mb-2 ${montserrat.className}`}
					>
						{report.title}
					</CardTitle>
					<div className="flex flex-wrap gap-1">
						{report.activityType.map((type) => (
							<Badge key={type} variant="outline" className="mr-1 mb-1">
								{type}
							</Badge>
						))}
					</div>
				</CardHeader>
				<CardContent className="flex-grow">
					<div className="flex items-center gap-2 mb-4 text-gray-600">
						<FaMapMarker className="text-gray-400" />
						<span className="font-medium">
							{report.location.objective}, {report.location.region}
						</span>
					</div>
					<div className="mb-4 text-sm text-gray-600">
						<p>Distance: {report.distance} miles</p>
						<p>Elevation Gain: {report.elevationGain} ft</p>
						<p>Elevation Loss: {report.elevationLoss} ft</p>
					</div>
					{report.description && (
						<p className="text-sm text-gray-700 line-clamp-3">
							{report.description}
						</p>
					)}
				</CardContent>
				<CardFooter className="mt-auto flex justify-between items-center pt-4">
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
