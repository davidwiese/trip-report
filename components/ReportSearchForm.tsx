"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type ReportSearchFormProps = {
	// Add any props here if needed
};

const ReportSearchForm: React.FC<ReportSearchFormProps> = () => {
	const [location, setLocation] = useState("");
	const [reportType, setReportType] = useState("");

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

	const handleReportTypeChange = (value: string) => {
		setReportType(value);
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
				<Input
					type="text"
					id="location"
					placeholder="Enter location or keywords"
					className="w-full px-4 py-3 rounded-lg bg-black placeholder:text-white"
					value={location}
					onChange={(e) => setLocation(e.target.value)}
				/>
			</div>
			<div className="w-full md:w-2/5 md:pl-2">
				<label htmlFor="report-type" className="sr-only">
					Trip Type
				</label>
				<Select value={reportType} onValueChange={handleReportTypeChange}>
					<SelectTrigger id="report-type" className="w-full bg-black">
						<SelectValue placeholder="Select trip type" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Trip Type</SelectLabel>
							<SelectItem value="All">All</SelectItem>
							<SelectItem value="Hiking">Hiking</SelectItem>
							<SelectItem value="Backpacking">Backpacking</SelectItem>
							<SelectItem value="Trail Running">Trail Running</SelectItem>
							<SelectItem value="Rock Climbing">Rock Climbing</SelectItem>
							<SelectItem value="Sport Climbing">Sport Climbing</SelectItem>
							<SelectItem value="Trad Climbing">Trad Climbing</SelectItem>
							<SelectItem value="Aid Climbing">Aid Climbing</SelectItem>
							<SelectItem value="Ice Climbing">Ice Climbing</SelectItem>
							<SelectItem value="Mixed Climbing">Mixed Climbing</SelectItem>
							<SelectItem value="Mountaineering">Mountaineering</SelectItem>
							<SelectItem value="Ski Mountaineering">
								Ski Mountaineering
							</SelectItem>
							<SelectItem value="Ski Touring">Ski Touring</SelectItem>
							<SelectItem value="Canyoneering">Canyoneering</SelectItem>
							<SelectItem value="Mountain Biking">Mountain Biking</SelectItem>
							<SelectItem value="Cycling">Cycling</SelectItem>
							<SelectItem value="Bikepacking">Bikepacking</SelectItem>
							<SelectItem value="Kayaking">Kayaking</SelectItem>
							<SelectItem value="Packrafting">Packrafting</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<Button
				type="submit"
				className="md:ml-4 mt-4 md:mt-0 w-full md:w-auto px-6 py-3 glow-on-hover-search"
			>
				Search
			</Button>
		</form>
	);
};
export default ReportSearchForm;
