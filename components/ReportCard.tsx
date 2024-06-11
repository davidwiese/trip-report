import { Report } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { FaMapMarker } from "react-icons/fa";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
					layout="fill"
					objectFit="cover"
					className="rounded-t-xl"
					objectPosition="center"
				/>
			</div>
			<div className="flex flex-col flex-grow p-4">
				<CardHeader className="flex-grow">
					<CardTitle className="text-xl font-bold">{report.title}</CardTitle>
					<CardDescription className="text-gray-600">
						{report.activityType.join(", ")}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex-grow">
					<div className="flex items-center gap-2 mb-4">
						<FaMapMarker className="text-orange-700" />
						<span className="text-orange-700">
							{report.location.region} {report.location.objective}
						</span>
					</div>
					<div className="mb-4">
						<p className="text-sm text-gray-500">
							Distance: {report.distance} km
						</p>
						<p className="text-sm text-gray-500">
							Elevation Gain: {report.elevationGain} m
						</p>
						<p className="text-sm text-gray-500">
							Elevation Loss: {report.elevationLoss} m
						</p>
					</div>
					{report.description && (
						<p className="text-sm text-gray-700 line-clamp-3">
							{report.description}
						</p>
					)}
				</CardContent>
				<CardFooter className="mt-auto flex justify-between items-center pt-4">
					<Link
						href={`/profile/${report.owner}`}
						className="text-sm text-blue-500 z-30 hover:underline cursor-pointer"
					>
						View Profile
					</Link>
					<Button asChild className="z-30">
						<Link href={`/reports/${report._id}`} className="cursor-pointer">
							Details
						</Link>
					</Button>
				</CardFooter>
			</div>
		</Card>
	);
};

export default ReportCard;
