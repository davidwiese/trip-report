"use client";
import updateReport from "@/app/actions/updateReport";
import { ChangeEvent, useState, FormEvent } from "react";
import { toast } from "react-toastify";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import ReportBodyEditor from "@/components/ReportBodyEditor";
import SubmitButton from "@/components/SubmitButton";
import { Report as ReportType } from "@/types";

type ReportEditFormProps = {
	report: ReportType;
};

const ReportEditForm: React.FC<ReportEditFormProps> = ({ report }) => {
	const [body, setBody] = useState<string>(report.body || "");
	const [description, setDescription] = useState<string>(
		report.description || ""
	);
	const [country, setCountry] = useState(report.location.country || "");
	const [region, setRegion] = useState(report.location.region || "");
	const [errors, setErrors] = useState<string[]>([]);
	const [gpxKmlFile, setGpxKmlFile] = useState<File | null>(null);
	const [images, setImages] = useState<File[]>([]);
	const maxDescriptionLength = 500;

	const handleBodyChange = (content: string) => {
		setBody(content);
	};

	const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setDescription(e.target.value);
	};

	const handleCountryChange = (val: string) => {
		setCountry(val);
		const countryInput = document.getElementById(
			"location.country"
		) as HTMLInputElement;
		if (countryInput) {
			countryInput.value = val;
		}
	};

	const handleRegionChange = (val: string) => {
		setRegion(val);
		const regionInput = document.getElementById(
			"location.region"
		) as HTMLInputElement;
		if (regionInput) {
			regionInput.value = val;
		}
	};

	const handleGpxKmlFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setGpxKmlFile(e.target.files[0]);
		}
	};

	const removeGpxKmlFile = () => {
		setGpxKmlFile(null);
		const gpxInput = document.getElementById("gpxKmlFile") as HTMLInputElement;
		if (gpxInput) {
			gpxInput.value = "";
		}
	};

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const selectedFiles = Array.from(e.target.files);
			if (selectedFiles.length > 5) {
				toast.error("You can select up to 5 images");
			} else {
				setImages(selectedFiles);
			}
		}
	};

	const removeImage = (index: number) => {
		const newImages = images.filter((_, i) => i !== index);
		setImages(newImages);
		const imageInput = document.getElementById("images") as HTMLInputElement;
		if (imageInput) {
			const dt = new DataTransfer();
			newImages.forEach((file) => dt.items.add(file));
			imageInput.files = dt.files;
		}
	};

	const validateForm = () => {
		const newErrors: string[] = [];

		const checkedActivities = Array.from(
			document.querySelectorAll("input[name='activityType']:checked")
		).length;

		if (checkedActivities === 0)
			newErrors.push("At least one activity type is required");
		if (!description) newErrors.push("Description is required");
		if (description.length > maxDescriptionLength)
			newErrors.push("Description is too long");
		if (!country) newErrors.push("Country is required");
		if (!region) newErrors.push("Region is required");

		setErrors(newErrors);
		return newErrors.length === 0;
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		if (!validateForm()) {
			e.preventDefault();
		} else {
			// Add hidden body field to form data
			const form = e.currentTarget;
			const bodyInput = document.createElement("input");
			bodyInput.type = "hidden";
			bodyInput.name = "body";
			bodyInput.value = body;
			form.appendChild(bodyInput);
		}
	};

	const updateReportById = updateReport.bind(null, report._id);

	return (
		<form action={updateReportById} onSubmit={handleSubmit}>
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
							defaultChecked={report.activityType?.includes("Hiking")}
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
							defaultChecked={report.activityType?.includes("Backpacking")}
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
							defaultChecked={report.activityType?.includes("Trail Running")}
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
							defaultChecked={report.activityType?.includes("Rock Climbing")}
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
							defaultChecked={report.activityType?.includes("Sport Climbing")}
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
							defaultChecked={report.activityType?.includes("Trad Climbing")}
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
							defaultChecked={report.activityType?.includes("Aid Climbing")}
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
							defaultChecked={report.activityType?.includes("Ice Climbing")}
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
							defaultChecked={report.activityType?.includes("Mixed Climbing")}
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
							defaultChecked={report.activityType?.includes("Mountaineering")}
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
							defaultChecked={report.activityType?.includes("Ski Touring")}
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
							defaultChecked={report.activityType?.includes(
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
							defaultChecked={report.activityType?.includes("Canyoneering")}
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
							defaultChecked={report.activityType?.includes("Mountain Biking")}
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
							defaultChecked={report.activityType?.includes("Cycling")}
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
							defaultChecked={report.activityType?.includes("Bikepacking")}
						/>
						<label htmlFor="activityType_canoeing">Bikepacking</label>
					</div>
					<div>
						<input
							type="checkbox"
							id="activityType_kayaking"
							name="activityType"
							value="Kayaking"
							className="mr-2"
							defaultChecked={report.activityType?.includes("Kayaking")}
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
							defaultChecked={report.activityType?.includes("Packrafting")}
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
					onChange={handleCountryChange}
					priorityOptions={["US", "CA", "MX", "GB", "FR", "DE", "IT", "ES"]}
					classes="border rounded w-full py-2 px-3 mb-2"
				/>
				<RegionDropdown
					country={country}
					value={region}
					onChange={handleRegionChange}
					disableWhenEmpty={true}
					blankOptionLabel="Select Region"
					classes="border rounded w-full py-2 px-3 mb-2"
				/>
				<input
					type="hidden"
					id="location.country"
					name="location.country"
					value={country}
				/>
				<input
					type="hidden"
					id="location.region"
					name="location.region"
					value={region}
				/>
				<input
					type="text"
					id="localArea"
					name="location.localArea"
					className="border rounded w-full py-2 px-3 mb-2"
					placeholder="Local area (mountain range, park, etc.)"
					required
					defaultValue={report.location.localArea}
				/>
				<input
					type="text"
					id="objective"
					name="location.objective"
					className="border rounded w-full py-2 px-3"
					placeholder="Objective (specific trail, peak, or climb, etc.)"
					required
					defaultValue={report.location.objective}
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
						required
						defaultValue={report.distance}
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
						required
						defaultValue={report.elevationGain}
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
						required
						defaultValue={report.elevationLoss}
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
					required
					defaultValue={report.duration}
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
					required
					defaultValue={report.startDate}
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
					required
					defaultValue={report.endDate}
				/>
			</div>

			<div className="mb-4">
				<label
					htmlFor="gpxKmlFile"
					className="block text-gray-700 font-bold mb-2"
				>
					Upload GPX/KML File (optional)
				</label>
				<input
					type="file"
					id="gpxKmlFile"
					name="gpxKmlFile"
					className="border rounded w-full py-2 px-3"
					accept=".gpx,.kml"
					onChange={handleGpxKmlFileChange}
				/>
				{gpxKmlFile && (
					<div className="mt-2">
						<span>{gpxKmlFile.name}</span>
						<button
							type="button"
							className="ml-2 text-red-500"
							onClick={removeGpxKmlFile}
						>
							Remove
						</button>
					</div>
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
					defaultValue={report.caltopoUrl || "e.g. https://caltopo.com/m/EH41"}
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
					required
					defaultValue={report.title}
				/>
			</div>

			<div className="mb-4">
				<label htmlFor="body" className="block text-gray-700 font-bold mb-2">
					Trip Report
				</label>
				<input
					type="hidden"
					name="body"
					value={body}
					defaultValue={report.body}
				/>
				<div className="border rounded">
					<ReportBodyEditor onChange={handleBodyChange} />
				</div>
			</div>

			<div className="mb-4">
				<label htmlFor="images" className="block text-gray-700 font-bold mb-2">
					Images (Select up to 5 images, optional)
				</label>
				<input
					type="file"
					id="images"
					name="images"
					className="border rounded w-full py-2 px-3"
					accept="image/*"
					multiple
					onChange={handleImageChange}
				/>
				{images.length > 0 && (
					<div className="mt-2">
						<ul>
							{images.map((image, index) => (
								<li key={index} className="flex items-center">
									<span>{image.name}</span>
									<button
										type="button"
										className="ml-2 text-red-500"
										onClick={() => removeImage(index)}
									>
										Remove
									</button>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>

			<div>
				<SubmitButton />
			</div>
			{errors.length > 0 && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
					<ul>
						{errors.map((error, index) => (
							<li key={index}>{error}</li>
						))}
					</ul>
				</div>
			)}
		</form>
	);
};

export default ReportEditForm;
