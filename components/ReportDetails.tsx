import Link from "next/link";
import { FaRulerCombined, FaCheck, FaMapMarker } from "react-icons/fa";
import { LuMoveUpRight, LuMoveDownRight } from "react-icons/lu";
import { Report } from "@/types";
import { montserrat } from "@/app/fonts";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ReportDetailsProps = {
	report: Report;
	author: { name: string; id: string };
};

const ReportDetails: React.FC<ReportDetailsProps> = ({ report, author }) => {
	return (
		<main className="space-y-6">
			<Card className="bg-white rounded-xl shadow-md max-w-6xl mx-auto">
				<CardHeader className="pb-2">
					<CardTitle
						className={`text-3xl font-bold mb-1 ${montserrat.className}`}
					>
						{report.title}
					</CardTitle>
					<CardDescription className="text-gray-500 flex flex-col gap-1 mt-2">
						<div className="flex items-center text-lg">
							<FaMapMarker className="text-gray-400" />
							<span className="ml-1">
								{report.location.objective}, {report.location.region}
							</span>
						</div>
						<div className="ml-1 mb-2">
							<span className="font-medium">Author:</span>{" "}
							<Link
								href={`/profile/${author.id}`}
								className="text-blue-500 hover:underline"
							>
								{author.name}
							</Link>
						</div>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap justify-between text-gray-500 text-base mb-4">
						<p className="flex items-center mb-2">
							<LuMoveUpRight className="inline-block mr-1" />
							<span className="font-medium">Elevation Gain: </span>{" "}
							{report.elevationGain} ft
						</p>
						<p className="flex items-center mb-2">
							<LuMoveDownRight className="inline-block mr-1" />
							<span className="font-medium">Elevation Loss: </span>{" "}
							{report.elevationLoss} ft
						</p>
						<p className="flex items-center mb-2">
							<FaRulerCombined className="inline-block mr-1" />
							<span className="font-medium">Distance: </span> {report.distance}{" "}
							miles
						</p>
						<p className="flex items-center mb-2">
							<span className="font-medium">Start Date: </span>{" "}
							{new Date(report.startDate).toLocaleDateString()}
						</p>
						<p className="flex items-center mb-2">
							<span className="font-medium">End Date: </span>{" "}
							{new Date(report.endDate).toLocaleDateString()}
						</p>
						<p className="flex items-center mb-2">
							<span className="font-medium">Duration:</span> {report.duration}{" "}
							hours
						</p>
					</div>
					<div className="text-gray-500 mb-4">
						<h3 className="text-lg font-bold mb-2">Description</h3>
						<p>{report.description}</p>
					</div>
					<div className="text-gray-500 mb-4">
						<h3 className="text-lg font-bold mb-2">Activity Type</h3>
						<div className="flex flex-wrap gap-2">
							{report.activityType.map((type) => (
								<Badge key={type} variant="outline" className="mr-1">
									{type}
								</Badge>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="bg-white rounded-xl shadow-md max-w-3xl mx-auto p-6">
				<h2 className={`text-2xl font-bold mb-4 ${montserrat.className}`}>
					Trip Report
				</h2>
				<div
					className="prose max-w-none"
					dangerouslySetInnerHTML={{ __html: report.body }}
				/>
			</div>
		</main>
	);
};

export default ReportDetails;

// Download link for GPX/KML file and Caltopo map embed:
// {
// 	report.gpxKmlFile && (
// 		<a
// 			href={report.gpxKmlFile}
// 			download
// 			className="text-gray-500 hover:underline"
// 		>
// 			Download GPX/KML File
// 		</a>
// 	);
// }

// {
// 	report.caltopoUrl && (
// 		<iframe
// 			src={report.caltopoUrl}
// 			width="100%"
// 			height="500"
// 			style={{ border: 0 }}
// 			allowFullScreen
// 		></iframe>
// 	);
// }
