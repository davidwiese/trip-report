import Link from "next/link";
import {
	LuMoveUpRight,
	LuMoveDownRight,
	LuClock4,
	LuGlobe2,
} from "react-icons/lu";
import { RxRulerHorizontal } from "react-icons/rx";
import { TbCalendarSmile } from "react-icons/tb";
import { PiPersonSimpleHikeBold } from "react-icons/pi";
import { Report } from "@/types";
import { montserrat } from "@/app/fonts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookmarkButton from "@/components/BookmarkButton";
import DownloadButton from "@/components/DownloadButton";
import { Badge } from "@/components/ui/badge";
import { TbMap2 } from "react-icons/tb";

type ReportDetailsProps = {
	report: Report;
	author: { name: string; id: string };
};

const ReportDetails: React.FC<ReportDetailsProps> = ({ report, author }) => {
	const isSameDate =
		new Date(report.startDate).toLocaleDateString() ===
		new Date(report.endDate).toLocaleDateString();

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString(undefined, {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<main className="space-y-6">
			<Card className="bg-white rounded-xl shadow-md max-w-6xl mx-auto mb-16">
				<CardHeader>
					<CardTitle className={`mb-1 ${montserrat.className}`}>
						<div className="text-gray-700 flex flex-col md:flex-row justify-between items-start mt-2">
							<div className="flex flex-col text-lg flex-shrink">
								<div className="mb-1">
									<TbMap2 className="inline-block text-2xl mr-1" />
									<span className="ml-1">
										{report.location.objective}, {report.location.localArea}
									</span>
								</div>
								<div>
									<LuGlobe2 className="inline-block text-2xl mr-1" />
									<span className="ml-1">
										{report.location.region}, {report.location.country}
									</span>
								</div>
							</div>
							<div className="text-right mt-4 md:mt-0">
								<div>
									<PiPersonSimpleHikeBold className="inline-block mr-1" />
									<Link
										href={`/profile/${author.id}`}
										className="text-gray-600 text-sm underline ml-1"
									>
										{author.name}
									</Link>
								</div>
							</div>
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-1 text-base mb-6">
						{[
							{
								icon: <LuMoveUpRight className="inline-block text-2xl" />,
								label: "Elevation Gain",
								value: `${report.elevationGain.toFixed(0)} ft`,
							},
							{
								icon: <LuMoveDownRight className="inline-block text-2xl" />,
								label: "Elevation Loss",
								value: `${report.elevationLoss.toFixed(0)} ft`,
							},
							{
								icon: <RxRulerHorizontal className="inline-block text-2xl" />,
								label: "Distance",
								value: `${report.distance.toFixed(2)} miles`,
							},
							{
								icon: <LuClock4 className="inline-block text-xl" />,
								label: "Duration",
								value: `${report.duration} hours`,
							},
						].map((stat, index) => (
							<Card
								key={index}
								className="flex items-center justify-center text-center p-2 min-w-[100px] sm:min-w-[140px]"
							>
								<div className="flex items-center space-x-2 w-full justify-center">
									{stat.icon}
									<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 w-full justify-center">
										<span className="font-medium text-sm hidden sm:block">
											{stat.label}:
										</span>
										<span>{stat.value}</span>
									</div>
								</div>
							</Card>
						))}
						{isSameDate ? (
							<Card className="flex items-center justify-center text-center p-2 min-w-[100px] sm:min-w-[140px]">
								<div className="flex items-center space-x-2 w-full justify-center">
									<TbCalendarSmile className="inline-block text-2xl" />
									<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 w-full justify-center">
										<span className="font-medium text-sm hidden sm:block">
											Date:
										</span>
										<span>{formatDate(report.startDate)}</span>
									</div>
								</div>
							</Card>
						) : (
							<>
								<Card className="flex items-center justify-center text-center p-2 min-w-[100px] sm:min-w-[140px]">
									<div className="flex items-center space-x-2 w-full justify-center">
										<TbCalendarSmile className="inline-block text-2xl" />
										<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 w-full justify-center">
											<span className="font-medium text-sm hidden sm:block">
												Start Date:
											</span>
											<span>{formatDate(report.startDate)}</span>
										</div>
									</div>
								</Card>
								<Card className="flex items-center justify-center text-center p-2 min-w-[100px] sm:min-w-[140px]">
									<div className="flex items-center space-x-2 w-full justify-center">
										<TbCalendarSmile className="inline-block text-2xl" />
										<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 w-full justify-center">
											<span className="font-medium text-sm hidden sm:block">
												End Date:
											</span>
											<span>{formatDate(report.endDate)}</span>
										</div>
									</div>
								</Card>
							</>
						)}
					</div>
					<div className="text-gray-700 mb-6">
						<h3 className="text-lg font-bold mb-2">Description</h3>
						<p
							style={{
								whiteSpace: "pre-wrap",
								wordWrap: "break-word",
								overflowWrap: "break-word",
							}}
						>
							{report.description}
						</p>
					</div>
					<div className="text-gray-700 mb-4 flex justify-between items-center">
						<div>
							<h3 className="text-lg font-bold mb-2">Trip Type</h3>
							<div className="flex flex-wrap gap-1">
								{report.activityType.map((type) => (
									<Badge key={type} variant="outline" className="mr-1">
										{type}
									</Badge>
								))}
							</div>
						</div>
						<div className="self-end">
							<div className="mb-1">
								<DownloadButton report={report} />
							</div>
							<div>
								<BookmarkButton report={report} />
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="bg-white rounded-xl max-w-[45rem] mx-auto p-6">
				<h2 className={`text-4xl font-bold mb-10 ${montserrat.className}`}>
					{report.title}
				</h2>
				<div
					className="prose max-w-none report-body"
					dangerouslySetInnerHTML={{ __html: report.body }}
				/>
			</div>
		</main>
	);
};

export default ReportDetails;
