import { montserrat } from "@/app/ui/fonts";
import BookmarkButton from "@/components/BookmarkButton";
import DateCard from "@/components/DateCard";
import DownloadButton from "@/components/DownloadButton";
import EditButton from "@/components/EditButton";
import StatCard from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Report } from "@/types";
import Link from "next/link";
import {
	LuClock4,
	LuGlobe2,
	LuMoveDownRight,
	LuMoveUpRight,
} from "react-icons/lu";
import { PiPersonSimpleHikeBold } from "react-icons/pi";
import { RxRulerHorizontal } from "react-icons/rx";
import { TbCalendarSmile, TbMap2 } from "react-icons/tb";

type ReportDetailsProps = {
	report: Report;
	author: { name: string; id: string; mongoId: string };
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
			<Card className="bg-white dark:bg-black dark:border rounded-xl shadow-md max-w-6xl mx-auto mb-16">
				<CardHeader>
					<CardTitle className={`mb-1 ${montserrat.className}`}>
						<div className="text-gray-700 dark:text-white flex flex-col md:flex-row justify-between items-start mt-2">
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
										href={`/profile/${author.mongoId}`}
										className="text-gray-600 dark:text-white text-sm underline ml-1"
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
					<div className="text-gray-700 dark:text-white mb-6">
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
					<div className="text-gray-700 dark:text-white mb-4 flex justify-between items-center">
						<div>
							<h3 className="text-lg font-bold mb-2">Trip Type</h3>
							<div className="flex flex-wrap gap-1">
								{report.activityType.map((type) => (
									<Badge
										key={type}
										variant="outline"
										className="mr-1 dark:text-white"
									>
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

			<div className="bg-white dark:bg-black dark:border dark:text-white rounded-xl max-w-[45rem] mx-auto p-6">
				<h2
					className={`text-4xl dark:text-white font-bold mb-10 ${montserrat.className}`}
				>
					{report.title}
				</h2>
				<div
					className="prose max-w-none report-body dark:prose-dark"
					dangerouslySetInnerHTML={{ __html: report.body }}
				/>
			</div>
		</main>
	);
};

export default ReportDetails;
