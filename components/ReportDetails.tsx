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
import { montserrat } from "@/app/ui/fonts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BookmarkButton from "@/components/BookmarkButton";
import DownloadButton from "@/components/DownloadButton";
import EditButton from "@/components/EditButton";
import { Badge } from "@/components/ui/badge";
import { TbMap2 } from "react-icons/tb";
import DateCard from "@/components/DateCard";
import StatCard from "@/components/StatCard";

type ReportDetailsProps = {
	report: Report;
	author: { name: string; id: string };
	isAuthor: boolean;
};

const ReportDetails: React.FC<ReportDetailsProps> = ({
	report,
	author,
	isAuthor,
}) => {
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
						<StatCard
							icon={
								<LuMoveUpRight className="inline-block text-2xl flex-shrink-0" />
							}
							label="Elevation Gain"
							value={`${report.elevationGain.toFixed(0)} ft`}
						/>
						<StatCard
							icon={
								<LuMoveDownRight className="inline-block text-2xl flex-shrink-0" />
							}
							label="Elevation Loss"
							value={`${report.elevationLoss.toFixed(0)} ft`}
						/>
						<StatCard
							icon={
								<RxRulerHorizontal className="inline-block text-2xl flex-shrink-0" />
							}
							label="Distance"
							value={`${report.distance.toFixed(2)} miles`}
						/>
						<StatCard
							icon={<LuClock4 className="inline-block text-xl flex-shrink-0" />}
							label="Duration"
							value={`${report.duration} hours`}
						/>
						{isSameDate ? (
							<DateCard
								icon={
									<TbCalendarSmile className="inline-block text-2xl flex-shrink-0" />
								}
								label="Date"
								date={formatDate(report.startDate)}
							/>
						) : (
							<>
								<DateCard
									icon={
										<TbCalendarSmile className="inline-block text-2xl flex-shrink-0" />
									}
									label="Start Date"
									date={formatDate(report.startDate)}
								/>
								<DateCard
									icon={
										<TbCalendarSmile className="inline-block text-2xl flex-shrink-0" />
									}
									label="End Date"
									date={formatDate(report.endDate)}
								/>
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
						<div className="self-end space-y-1">
							{isAuthor && (
								<div>
									<EditButton report={report} />
								</div>
							)}
							<div>
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
