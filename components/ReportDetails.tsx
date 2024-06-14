import Link from "next/link";
import { FaRulerCombined, FaCheck, FaMapMarker } from "react-icons/fa";
import { LuMoveUpRight, LuMoveDownRight, LuClock4 } from "react-icons/lu";
import { RxRulerHorizontal } from "react-icons/rx";
import { TbCalendarSmile } from "react-icons/tb";
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
	const isSameDate =
		new Date(report.startDate).toLocaleDateString() ===
		new Date(report.endDate).toLocaleDateString();

	return (
		<main className="space-y-6">
			<Card className="bg-white rounded-xl shadow-md max-w-7xl mx-auto">
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
					<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-gray-500 text-base mb-4">
						{[
							{
								icon: <LuMoveUpRight className="inline-block text-2xl" />,
								label: "Elevation Gain",
								value: `${report.elevationGain} ft`,
							},
							{
								icon: <LuMoveDownRight className="inline-block text-2xl" />,
								label: "Elevation Loss",
								value: `${report.elevationLoss} ft`,
							},
							{
								icon: <RxRulerHorizontal className="inline-block text-2xl" />,
								label: "Distance",
								value: `${report.distance} miles`,
							},
							{
								icon: <LuClock4 className="inline-block text-xl" />,
								label: "Duration",
								value: `${report.duration} hours`,
							},
						].map((stat, index) => (
							<Card
								key={index}
								className="flex items-center p-2 min-w-[120px] sm:min-w-[180px]"
							>
								<div className="flex items-center space-x-2 w-full">
									{stat.icon}
									<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 w-full">
										<span className="font-medium text-sm hidden sm:block">
											{stat.label}:
										</span>
										<span>{stat.value}</span>
									</div>
								</div>
							</Card>
						))}
						{isSameDate ? (
							<Card className="flex items-center p-2 min-w-[120px] sm:min-w-[180px]">
								<div className="flex items-center space-x-2 w-full">
									<TbCalendarSmile className="inline-block text-2xl" />
									<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 w-full">
										<span className="font-medium text-sm hidden sm:block">
											Date:
										</span>
										<span>
											{new Date(report.startDate).toLocaleDateString()}
										</span>
									</div>
								</div>
							</Card>
						) : (
							<>
								<Card className="flex items-center p-2">
									<div className="flex items-center space-x-2 w-full">
										<TbCalendarSmile className="inline-block text-2xl" />
										<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 w-full">
											<span className="font-medium text-sm hidden sm:block">
												Start Date:
											</span>
											<span>
												{new Date(report.startDate).toLocaleDateString()}
											</span>
										</div>
									</div>
								</Card>
								<Card className="flex items-center p-2">
									<div className="flex items-center space-x-2 w-full">
										<TbCalendarSmile className="inline-block text-2xl" />
										<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 w-full">
											<span className="font-medium text-sm hidden sm:block">
												End Date:
											</span>
											<span>
												{new Date(report.endDate).toLocaleDateString()}
											</span>
										</div>
									</div>
								</Card>
							</>
						)}
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
