"use client";
import updateReport from "@/app/actions/updateReport";
import SubmitButton from "@/components/SubmitButton";
import { Report as ReportType } from "@/types";
import { ChangeEvent, useState } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import ReportBodyEditor from "@/components/ReportBodyEditor";
import Image from "next/image";

type ReportEditFormProps = {
	report: ReportType;
};

const ReportEditForm: React.FC<ReportEditFormProps> = ({ report }) => {
	const [content, setContent] = useState<string>(report.body);
	const [description, setDescription] = useState<string>(report.description);
	const [country, setCountry] = useState(report.location.country);
	const [region, setRegion] = useState(report.location.region);
	const [gpxKmlFile, setGpxKmlFile] = useState<File | null>(null);
	const [isFileRemoved, setIsFileRemoved] = useState(false);
	const [selectedImages, setSelectedImages] = useState<File[]>([]);
	const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
	const maxDescriptionLength = 500;

	const handleContentChange = (value: string) => {
		setContent(value);
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files?.length) {
			setGpxKmlFile(event.target.files[0]);
			setIsFileRemoved(false); // Reset removal flag if new file is selected
		}
	};

	const removeFile = () => {
		setGpxKmlFile(null);
		setIsFileRemoved(true);
	};

	const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setDescription(e.target.value);
	};

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			setSelectedImages([...selectedImages, ...Array.from(event.target.files)]);
		}
	};

	const handleRemoveImage = (imageUrl: string) => {
		setImagesToRemove([...imagesToRemove, imageUrl]);
	};

	// NOTE: to pass the id to our server action we can use Function.bind
	//https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#passing-additional-arguments

	const updateReportById = updateReport.bind(null, report._id);

	return (
		<form action={updateReportById}>
			<h2 className="text-3xl text-center font-semibold mb-6">
				Edit Trip Report
			</h2>

			<div className="mb-4">
				<label className="block text-gray-700 font-bold mb-2">
					Activity Type
				</label>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
					<div>
						<input
							type="checkbox"
							id="activityType_hiking"
							name="activityType"
							value="Hiking"
							className="mr-2"
							defaultChecked={report.activityType.includes("Hiking")}
						/>
						<label htmlFor="activityType_hiking">Hiking</label>
					</div>
					<div>
						<input
							type="checkbox"
							id="activityType_backpacking"
							name="activityType"
							value="Backpacking"
							className="mr-2"
							defaultChecked={report.activityType.includes("Backpacking")}
						/>
						<label htmlFor="activityType_backpacking">Backpacking</label>
					</div>
					<div>
						<input
							type="checkbox"
							id="activityType_trailRunning"
							name="activityType"
							value="Trail Running"
							className="mr-2"
							defaultChecked={report.activityType.includes("Trail Running")}
						/>
						<label htmlFor="activityType_trailRunning">Trail Running</label>
					</div>
					<div>
						<input
							type="checkbox"
							id="activityType_rockClimbing"
							name="activityType"
							value="Rock Climbing"
							className="mr-2"
							defaultChecked={report.activityType.includes("Rock Climbing")}
						/>
						<label htmlFor="activityType_rockClimbing">Rock Climbing</label>
					</div>
					<div>
						<input
							type="checkbox"
							id="activityType_sportClimbing"
							name="activityType"
							value="Sport Climbing"
							className="mr-2"
							defaultChecked={report.activityType.includes("Sport Climbing")}
						/>
						<label htmlFor="activityType_sportClimbing">Sport Climbing</label>
					</div>
					<div>
						<input
							type="checkbox"
							id="activityType_tradClimbing"
							name="activityType"
							value="Trad Climbing"
							className="mr-2"
							defaultChecked={report.activityType.includes("Trad Climbing")}
						/>
						<label htmlFor="activityType_tradClimbing">Trad Climbing</label>
					</div>
					<div>
						<input
							type="checkbox"
							id="activityType_aidClimbing"
							name="activityType"
							value="Aid Climbing"
							className="mr-2"
							defaultChecked={report.activityType.includes("Aid Climbing")}
						/>
						<label htmlFor="activityType_aidClimbing">Aid Climbing</label>
					</div>
					<div>
						<input
							type="checkbox"
							id="activityType_iceClimbing"
							name="activityType"
							value="Ice Climbing"
							className="mr-2"
							defaultChecked={report.activityType.includes("Ice Climbing")}
						/>
						<label htmlFor="activityType_iceClimbing">Ice Climbing</label>
					</div>
					<div>
						<input
							type="checkbox"
							id="activityType_mixedClimbing"
							name="activityType"
							value="Mixed Climbing"
							className="mr-2"
							defaultChecked={report.activityType.includes("Mixed Climbing")}
						/>
						<label htmlFor="activityType_mixedClimbing">Mixed Climbing</label>
					</div>
					<div>
						<input
							type="checkbox"
							id="activityType_mountaineering"
							name="activityType"
							value="Mountaineering"
							className="mr-2"
							defaultChecked={report.activityType.includes("Mountaineering")}
						/>
						<label htmlFor="activityType_mountaineering">Mountaineering</label>
					</div>
					<div>
						<input
							type="checkbox"
							id="activityType_skiTouring"
							name="activityType"
							value="Ski Touring"
							className="mr-2"
							defaultChecked={report.activityType.includes("Ski Touring")}
						/>
						<label htmlFor="activityType_skiTouring">Ski Touring</label>
					</div>
					<div>
						<input
							type="checkbox"
							id="activityType_skiMountaineering"
							name="activityType"
							value="Ski Mountaineering"
							className="mr-2"
							defaultChecked={report.activityType.includes(
								"Ski Mountaineering"
							)}
						/>
						<label htmlFor="activityType_skiMountaineering">
							Ski Mountaineering
						</label>
					</div>
					<div>
						<input
							type="checkbox"
							id="activityType_canyoneering"
							name="activityType"
							value="Canyoneering"
							className="mr-2"
							defaultChecked={report.activityType.includes("Canyoneering")}
						/>
						<label htmlFor="activityType_canyoneering">Canyoneering</label>
					</div>
					<div>
						<input
							type="checkbox"
							id="activityType_mountainBiking"
							name="activityType"
							value="Mountain Biking"
							className="mr-2"
							defaultChecked={report.activityType.includes("Mountain Biking")}
						/>
						<label htmlFor="activityType_mountainBiking">Mountain Biking</label>
					</div>
					<div>
						<input
							type="checkbox"
							id="activityType_cycling"
							name="activityType"
							value="Cycling"
							className="mr-2"
							defaultChecked={report.activityType.includes("Cycling")}
						/>
						<label htmlFor="activityType_cycling">Cycling</label>
					</div>
					<div>
						<input
							type="checkbox"
							id="activityType_bikepacking"
							name="activityType"
							value="Bikepacking"
							className="mr-2"
							defaultChecked={report.activityType.includes("Bikepacking")}
						/>
						<label htmlFor="activityType_bikepacking">Bikepacking</label>
					</div>
					<div>
						<input
							type="checkbox"
							id="activityType_kayaking"
							name="activityType"
							value="Kayaking"
							className="mr-2"
							defaultChecked={report.activityType.includes("Kayaking")}
						/>
						<label htmlFor="activityType_kayaking">Kayaking</label>
					</div>
					<div>
						<input
							type="checkbox"
							id="activityType_packrafting"
							name="activityType"
							value="Packrafting"
							className="mr-2"
							defaultChecked={report.activityType.includes("Packrafting")}
						/>
						<label htmlFor="activityType_packrafting">Packrafting</label>
					</div>
				</div>
			</div>

			<div className="mb-4">
				<label
					htmlFor="description"
					className="block text-gray-700 font-bold mb-2"
				>
					Description
				</label>
				<textarea
					id="description"
					name="description"
					className="border rounded w-full py-2 px-3"
					rows={4}
					placeholder="Add a brief description of your trip (500 character limit)"
					maxLength={500}
					value={description}
					onChange={handleDescriptionChange}
					defaultValue={report.description}
					required
				></textarea>
				<div className="text-right text-sm mt-1 text-gray-600">
					{maxDescriptionLength - description.length} characters remaining
				</div>
			</div>

			<div className="mb-4">
				<label className="block text-gray-700 font-bold mb-2">Location</label>
				<CountryDropdown
					value={country}
					onChange={(val) => setCountry(val)}
					priorityOptions={["US", "CA", "MX", "GB", "FR", "DE", "IT", "ES"]}
					classes="border rounded w-full py-2 px-3 mb-2"
				/>
				<RegionDropdown
					country={country}
					value={region}
					onChange={(val) => setRegion(val)}
					disableWhenEmpty={true}
					blankOptionLabel="Select Region"
					classes="border rounded w-full py-2 px-3 mb-2"
				/>
				<input
					type="text"
					id="localArea"
					name="location.localArea"
					className="border rounded w-full py-2 px-3 mb-2"
					placeholder="Local area (peak or trail name, mountain range, park, etc.)"
					defaultValue={report.location.localArea}
					required
				/>
			</div>

			<div className="mb-4 flex flex-wrap">
				<div className="w-full sm:w-1/3 pr-2">
					<label
						htmlFor="distance"
						className="block text-gray-700 font-bold mb-2"
					>
						Distance (miles)
					</label>
					<input
						type="number"
						id="distance"
						name="distance"
						className="border rounded w-full py-2 px-3"
						defaultValue={report.distance}
						required
					/>
				</div>
				<div className="w-full sm:w-1/3 px-2">
					<label
						htmlFor="elevationGain"
						className="block text-gray-700 font-bold mb-2"
					>
						Elevation Gain (ft)
					</label>
					<input
						type="number"
						id="elevationGain"
						name="elevationGain"
						className="border rounded w-full py-2 px-3"
						defaultValue={report.elevationGain}
						required
					/>
				</div>
				<div className="w-full sm:w-1/3 pl-2">
					<label
						htmlFor="elevationLoss"
						className="block text-gray-700 font-bold mb-2"
					>
						Elevation Loss (ft)
					</label>
					<input
						type="number"
						id="elevationLoss"
						name="elevationLoss"
						className="border rounded w-full py-2 px-3"
						defaultValue={report.elevationLoss}
						required
					/>
				</div>
			</div>

			<div className="mb-4">
				<label
					htmlFor="duration"
					className="block text-gray-700 font-bold mb-2"
				>
					Duration (hours)
				</label>
				<input
					type="number"
					id="duration"
					name="duration"
					className="border rounded w-full py-2 px-3"
					defaultValue={report.duration}
					required
				/>
			</div>

			<div className="mb-4">
				<label
					htmlFor="startDate"
					className="block text-gray-700 font-bold mb-2"
				>
					Start Date
				</label>
				<input
					type="date"
					id="startDate"
					name="startDate"
					className="border rounded w-full py-2 px-3"
					defaultValue={report.startDate}
					required
				/>
			</div>

			<div className="mb-4">
				<label htmlFor="endDate" className="block text-gray-700 font-bold mb-2">
					End Date
				</label>
				<input
					type="date"
					id="endDate"
					name="endDate"
					className="border rounded w-full py-2 px-3"
					defaultValue={report.endDate}
					required
				/>
			</div>

			<div className="mb-4">
				{report.gpxKmlFile && !isFileRemoved ? (
					<div>
						<p>Current File: {report.gpxKmlFile}</p>
						<button type="button" onClick={removeFile}>
							Remove File
						</button>
					</div>
				) : (
					<input
						type="file"
						id="gpxKmlFile"
						name="gpxKmlFile"
						onChange={handleFileChange}
						accept=".gpx,.kml"
					/>
				)}
				{isFileRemoved && (
					<input type="hidden" name="removeGpxKmlFile" value="true" />
				)}
			</div>

			<div className="mb-4">
				<label
					htmlFor="caltopoUrl"
					className="block text-gray-700 font-bold mb-2"
				>
					Caltopo URL (optional)
				</label>
				<input
					type="url"
					id="caltopoUrl"
					name="caltopoUrl"
					className="border rounded w-full py-2 px-3"
					placeholder="e.g. https://caltopo.com/m/EH41"
					defaultValue={report.caltopoUrl || ""}
				/>
			</div>

			<div className="mb-4">
				<label htmlFor="title" className="block text-gray-700 font-bold mb-2">
					Title
				</label>
				<input
					type="text"
					id="title"
					name="title"
					className="border rounded w-full py-2 px-3 mb-2"
					placeholder="Enter a title for your trip report"
					defaultValue={report.title}
					required
				/>
			</div>

			<div className="mb-4">
				<label htmlFor="body" className="block text-gray-700 font-bold mb-2">
					Trip Report
				</label>
				<input type="hidden" name="body" />
				<div className="border rounded">
					<ReportBodyEditor
						content={content}
						onChange={(value: string) => handleContentChange(value)}
					/>
				</div>
			</div>

			<div className="mb-4">
				{report.images.map((image, index) => (
					<div key={index}>
						<Image
							src={image}
							alt={`Report Image ${index + 1}`}
							layout="fill"
							objectFit="cover"
						/>{" "}
						<button type="button" onClick={() => handleRemoveImage(image)}>
							Remove Image
						</button>
					</div>
				))}
				<input
					type="file"
					multiple
					onChange={handleImageChange}
					accept="image/*"
				/>
				{/* Optionally display new selected images before upload */}
				{selectedImages.map((file, index) => (
					<div key={index}>
						<Image
							src={URL.createObjectURL(file)}
							alt={`New Image ${index + 1}`}
							layout="fill"
							objectFit="cover"
						/>
					</div>
				))}
				{imagesToRemove.map((image, index) => (
					<input
						key={index}
						type="hidden"
						name="imagesToRemove"
						value={image}
					/>
				))}
			</div>

			<div>
				<SubmitButton pendingText="Updating Report..." text="Update Report" />
			</div>
		</form>
	);
};

export default ReportEditForm;
