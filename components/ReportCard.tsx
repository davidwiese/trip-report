import { Report } from "@/types";
import Image from "next/image";
import Link from "next/link";
import {
	FaBed,
	FaBath,
	FaRulerCombined,
	FaMoneyBill,
	FaMapMarker,
} from "react-icons/fa";

type ReportCardProps = {
	report: Report;
};

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
	// const getRateDisplay = () => {
	// 	const { rates } = report;

	// 	if (rates.monthly) {
	// 		return `${rates.monthly.toLocaleString()}/mo`;
	// 	} else if (rates.weekly) {
	// 		return `${rates.weekly.toLocaleString()}/wk`;
	// 	} else if (rates.nightly) {
	// 		return `${rates.nightly.toLocaleString()}/night`;
	// 	}
	// };

	return (
		<div className="rounded-xl shadow-md relative">
			{report.images && report.images.length > 0 && (
				<Image
					src={report.images[0]}
					alt=""
					sizes="100vw"
					height={0}
					width={0}
					className="w-full h-auto rounded-t-xl"
				/>
			)}
			<div className="p-4">
				<div className="text-left md:text-center lg:text-left mb-6">
					<div className="text-gray-600">{report.activityType}</div>
					<h3 className="text-xl font-bold">{report.title}</h3>
				</div>
				<h3 className="absolute top-[10px] right-[10px] bg-white px-4 py-2 rounded-lg text-blue-500 font-bold text-right md:text-center lg:text-right">
					{/* ${getRateDisplay()} */}
				</h3>

				{/* <div className="flex justify-center gap-4 text-gray-500 mb-4">
					<p>
						<FaBed className="inline mr-2" />
						{report.beds} <span className="md:hidden lg:inline">Beds</span>
					</p>
					<p>
						<FaBath className="inline mr-2" />
						{report.baths} <span className="md:hidden lg:inline">Baths</span>
					</p>
					<p>
						<FaRulerCombined className="inline mr-2" />
						{report.square_feet}{" "}
						<span className="md:hidden lg:inline">sqft</span>
					</p>
				</div> */}

				{/* <div className="flex justify-center gap-4 text-green-900 text-sm mb-4">
					{report.rates.nightly && (
						<p>
							<FaMoneyBill className="inline mr-2" /> Nightly
						</p>
					)}
					{report.rates.weekly && (
						<p>
							<FaMoneyBill className="inline mr-2" /> Weekly
						</p>
					)}
					{report.rates.monthly && (
						<p>
							<FaMoneyBill className="inline mr-2" /> Monthly
						</p>
					)}
				</div> */}

				<div className="border border-gray-100 mb-5"></div>

				<div className="flex flex-col lg:flex-row justify-between mb-4">
					<div className="flex align-middle gap-2 mb-4 lg:mb-0">
						<FaMapMarker className="text-orange-700 mt-1" />
						<span className="text-orange-700">
							{" "}
							{report.location.country} {report.location.region}{" "}
							{report.location.localArea}{" "}
						</span>
					</div>
					<Link
						href={`/reports/${report._id}`}
						className="h-[36px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm"
					>
						Details
					</Link>
				</div>
			</div>
		</div>
	);
};
export default ReportCard;
