"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type ReportSearchFormProps = {
	// Add any props here if needed
};

const ReportSearchForm: React.FC<ReportSearchFormProps> = () => {
	const [location, setLocation] = useState("");
	const [reportType, setReportType] = useState("All");

	const router = useRouter();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (location === "" && reportType === "All") {
			router.push("/reports");
		} else {
			const query = `?location=${location}&reportType=${reportType}`;
			router.push(`/reports/search-results${query}`);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="mt-3 mx-auto max-w-2xl w-full flex flex-col md:flex-row items-center"
		>
			<div className="w-full md:w-3/5 md:pr-2 mb-4 md:mb-0">
				<label htmlFor="location" className="sr-only">
					Location
				</label>
				<input
					type="text"
					id="location"
					placeholder="Enter location or keywords"
					className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-blue-500"
					value={location}
					onChange={(e) => setLocation(e.target.value)}
				/>
			</div>
			<div className="w-full md:w-2/5 md:pl-2">
				<label htmlFor="report-type" className="sr-only">
					Trip Type
				</label>
				<select
					id="report-type"
					className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-blue-500"
					value={reportType}
					onChange={(e) => setReportType(e.target.value)}
				>
					<option value="All">All</option>
					<option value="Hiking">Hiking</option>
					<option value="Backpacking">Backpacking</option>
					<option value="Trail Running">Trail Running</option>
					<option value="Rock Climbing">Rock Climbing</option>
					<option value="Sport Climbing">Sport Climbing</option>
					<option value="Trad Climbing">Trad Climbing</option>
					<option value="Aid Climbing">Aid Climbing</option>
					<option value="Ice Climbing">Ice Climbing</option>
					<option value="Mixed Climbing">Mixed Climbing</option>
					<option value="Mountaineering">Mountaineering</option>
					<option value="Ski Mountaineering">Ski Mountaineering</option>
					<option value="Ski Touring">Ski Touring</option>
					<option value="Canyoneering">Canyoneering</option>
					<option value="Mountain Biking">Mountain Biking</option>
					<option value="Cycling">Cycling</option>
					<option value="Bikepacking">Bikepacking</option>
					<option value="Kayaking">Kayaking</option>
					<option value="Packrafting">Packrafting</option>
				</select>
			</div>
			<Button
				type="submit"
				className="md:ml-4 mt-4 md:mt-0 w-full md:w-auto px-6 py-3"
			>
				Search
			</Button>
		</form>
	);
};
export default ReportSearchForm;
