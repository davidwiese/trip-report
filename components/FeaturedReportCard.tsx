import Image from "next/image";
import Link from "next/link";
import {
	FaBed,
	FaBath,
	FaRulerCombined,
	FaMoneyBill,
	FaMapMarker,
} from "react-icons/fa";
import { Report } from "@/types";

type FeaturedReportCardProps = {
	report: Report;
};

const FeaturedReportCard: React.FC<FeaturedReportCardProps> = ({ report }) => {
	const getRateDisplay = () => {
		const { rates } = report;

		if (rates.monthly) {
			return `${rates.monthly.toLocaleString()}/mo`;
		} else if (rates.weekly) {
			return `${rates.weekly.toLocaleString()}/wk`;
		} else if (rates.nightly) {
			return `${rates.nightly.toLocaleString()}/night`;
		}
	};

	return (
		<div className="bg-white rounded-xl shadow-md relative flex flex-col md:flex-row">
			<Image
				src={report.images[0]}
				alt=""
				width={0}
				height={0}
				sizes="100vw"
				className="object-cover rounded-t-xl md:rounded-tr-none md:rounded-l-xl w-full md:w-2/5"
			/>
			<div className="p-6">
				<h3 className="text-xl font-bold">{report.name}</h3>
				<div className="text-gray-600 mb-4">{report.type}</div>
				<h3 className="absolute top-[10px] left-[10px] bg-white px-4 py-2 rounded-lg text-gray-500 font-bold text-right md:text-center lg:text-right">
					${getRateDisplay()}
				</h3>
				<div className="flex justify-center gap-4 text-gray-500 mb-4">
					<p>
						<FaBed className="inline-block mr-2" /> {report.beds}{" "}
						<span className="md:hidden lg:inline">Beds</span>
					</p>
					<p>
						<FaBath className="inline-block mr-2" /> {report.baths}{" "}
						<span className="md:hidden lg:inline">Baths</span>
					</p>
					<p>
						<FaRulerCombined className="inline-block mr-2" />
						{report.square_feet}{" "}
						<span className="md:hidden lg:inline">sqft</span>
					</p>
				</div>

				<div className="flex justify-center gap-4 text-green-900 text-sm mb-4">
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
				</div>

				<div className="border border-gray-200 mb-5"></div>

				<div className="flex flex-col lg:flex-row justify-between">
					<div className="flex align-middle gap-2 mb-4 lg:mb-0">
						<FaMapMarker className="text-orange-700 text-lg" />
						<span className="text-orange-700">
							{report.location.city} {report.location.state}
						</span>
					</div>
					<Link
						href={`/reports/${report._id}`}
						className="h-[36px] bg-black hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-center text-sm"
					>
						Details
					</Link>
				</div>
			</div>
		</div>
	);
};
export default FeaturedReportCard;
