// components/PublicProfileReports.tsx
import Image from "next/image";
import Link from "next/link";
import { Report as ReportType } from "@/types";

type PublicProfileReportsProps = {
	reports: ReportType[];
};

const PublicProfileReports: React.FC<PublicProfileReportsProps> = ({
	reports,
}) => {
	return reports.map((report) => (
		<div key={report._id} className="mb-10">
			<Link href={`/reports/${report._id}`}>
				{report.images && report.images.length > 0 ? (
					<Image
						className="h-32 w-full rounded-md object-cover"
						src={report.images[0].url}
						alt=""
						width={500}
						height={100}
						priority={true}
					/>
				) : (
					<div className="h-32 w-full rounded-md object-cover bg-gray-300 flex items-center justify-center">
						<span>No Image Available</span>
					</div>
				)}
			</Link>
			<div className="mt-2">
				<Link href={`/reports/${report._id}`}>
					<p className="text-lg font-semibold hover:underline">
						{report.title}
					</p>
				</Link>
				<p className="text-gray-600">
					Address: {report.location.country} {report.location.region}{" "}
					{report.location.localArea} {report.location.objective}
				</p>
			</div>
		</div>
	));
};

export default PublicProfileReports;
