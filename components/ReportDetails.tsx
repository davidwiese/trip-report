import {
	FaBed,
	FaBath,
	FaRulerCombined,
	FaTimes,
	FaCheck,
	FaMapMarker,
} from "react-icons/fa";
import { Report } from "@/types";

type ReportDetailsProps = {
	report: Report;
};

const ReportDetails: React.FC<ReportDetailsProps> = ({ report }) => {
	return (
		<main>
			<div className="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
				<div className="text-gray-500 mb-4">{report.title}</div>
				<h1 className="text-3xl font-bold mb-4">{report.description}</h1>
				<div className="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
					<FaMapMarker className="text-lg text-orange-700 mr-2" />
					<p className="text-orange-700">
						{report.location.country}, {report.location.region}{" "}
						{report.location.localArea}
					</p>
				</div>

				<h3 className="text-lg font-bold my-6 bg-gray-800 text-white p-2">
					Rates & Options
				</h3>
				<div className="flex flex-col md:flex-row justify-around">
					<div className="flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0">
						<div className="text-gray-500 mr-2 font-bold">Nightly</div>
					</div>
				</div>
			</div>

			<div className="bg-white p-6 rounded-lg shadow-md mt-6">
				<h3 className="text-lg font-bold mb-6">Description & Details</h3>
				<div className="flex justify-center gap-4 text-gray-500 mb-4 text-xl space-x-9">
					<p>
						<FaBed className="inline-block mr-2" /> {report.title}{" "}
						<span className="hidden sm:inline">Beds</span>
					</p>
					<p>
						<FaBath className="inline-block mr-2" /> {report.title}{" "}
						<span className="hidden sm:inline">Baths</span>
					</p>
					<p>
						<FaRulerCombined className="inline-block mr-2" /> {report.title}{" "}
						<span className="hidden sm:inline">sqft</span>
					</p>
				</div>
				<p className="text-gray-500 mb-4 text-center">{report.description}</p>
			</div>

			<div className="bg-white p-6 rounded-lg shadow-md mt-6">
				<h3 className="text-lg font-bold mb-6">Amenities</h3>

				<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 list-none space-y-2">
					{report.activityType.map((amenity: string, index: number) => (
						<li key={index}>
							<FaCheck className="text-green-600 mr-2 inline-block" /> {amenity}
						</li>
					))}
				</ul>
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
