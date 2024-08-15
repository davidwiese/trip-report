"use client";

import addReport from "@/app/actions/addReport";
import Label from "@/components/Label";
import ReportBodyEditor from "@/components/ReportBodyEditor";
import SubmitButton from "@/components/SubmitButton";
import { uploadImage } from "@/utils/cloudinaryUploader";
import {
	ChangeEvent,
	FormEvent,
	useCallback,
	useEffect,
	useState,
} from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { toast } from "react-toastify";

type ReportAddFormProps = {
	// Add any props here if needed
};

const ReportAddForm: React.FC<ReportAddFormProps> = () => {
	const [body, setBody] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [country, setCountry] = useState("");
	const [region, setRegion] = useState("");
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");
	const [dateError, setDateError] = useState<string>("");
	const [errors, setErrors] = useState<string[]>([]);
	const [gpxFile, setGpxFile] = useState<File | null>(null);
	const [images, setImages] = useState<File[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
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

	const handleGpxFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setGpxFile(e.target.files[0]);
		}
	};

	const removeGpxFile = () => {
		setGpxFile(null);
		const gpxInput = document.getElementById("gpxFile") as HTMLInputElement;

		if (gpxInput) {
			gpxInput.value = "";
		}
	};

	const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const selectedFiles = Array.from(e.target.files);
			const totalImages = images.length + selectedFiles.length;
			const maxFileSize = 10 * 1024 * 1024; // 10MB

			for (const file of selectedFiles) {
				if (file.size > maxFileSize) {
					toast.error(`${file.name} is too large. Maximum size is 10MB.`);
					setImages([]); // Clear the previously selected images
					e.target.value = ""; // Clear the file input
					return;
				}
			}

			if (totalImages > 10) {
				toast.error("You can select up to 10 images");
				setImages([]); // Clear the previously selected images
				e.target.value = ""; // Clear the file input
			} else {
				setImages(selectedFiles);
			}
		}
	};

	const removeImage = (index: number) => {
		setImages((prevImages) => prevImages.filter((_, i) => i !== index));
	};

	const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
		setStartDate(e.target.value);
	};

	const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEndDate(e.target.value);
	};

	const validateDates = useCallback(() => {
		if (startDate && endDate) {
			const start = new Date(startDate);
			const end = new Date(endDate);
			if (end < start) {
				setDateError("End date must be equal to or later than the start date.");
			} else {
				setDateError("");
			}
		} else {
			setDateError("");
		}
	}, [startDate, endDate]);

	useEffect(() => {
		validateDates();
	}, [validateDates]);

	const validateForm = () => {
		const newErrors: string[] = [];

		const checkedActivities = Array.from(
			document.querySelectorAll("input[name='activityType']:checked")
		).length;

		if (checkedActivities === 0) {
			newErrors.push("At least one activity type is required");
		}
		if (!description) newErrors.push("Description is required");
		if (description.length > maxDescriptionLength) {
			newErrors.push("Description is too long");
		}
		if (!country) newErrors.push("Country is required");
		if (!region) newErrors.push("Region is required");
		if (!(document.getElementById("localArea") as HTMLInputElement).value) {
			newErrors.push("Local area is required");
		}
		if (!(document.getElementById("objective") as HTMLInputElement).value) {
			newErrors.push("Objective is required");
		}
		if (!(document.getElementById("distance") as HTMLInputElement).value) {
			newErrors.push("Distance is required");
		}
		if (!(document.getElementById("elevationGain") as HTMLInputElement).value) {
			newErrors.push("Elevation gain is required");
		}
		if (!(document.getElementById("elevationLoss") as HTMLInputElement).value) {
			newErrors.push("Elevation loss is required");
		}
		if (!(document.getElementById("duration") as HTMLInputElement).value) {
			newErrors.push("Duration is required");
		}
		if (!startDate) newErrors.push("Start date is required");
		if (!endDate) newErrors.push("End date is required");
		if (!(document.getElementById("title") as HTMLInputElement).value) {
			newErrors.push("Title is required");
		}
		if (!body.trim()) newErrors.push("Trip report body cannot be empty");

		// Check if end date is before start date
		if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
			newErrors.push("End date must be equal to or later than the start date");
		}

		// Validate numeric fields
		const numericFields = [
			"distance",
			"elevationGain",
			"elevationLoss",
			"duration",
		];
		numericFields.forEach((field) => {
			const value = (document.getElementById(field) as HTMLInputElement).value;
			if (value && isNaN(Number(value))) {
				newErrors.push(`${field} must be a number`);
			}
		});

		const totalImages = images.length;

		if (totalImages > 10) {
			newErrors.push("You can select up to 10 images in total");
		}

		setErrors(newErrors);
		return newErrors.length === 0;
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);

		try {
			// Upload images and get their URLs
			const uploadedImages = await Promise.all(
				images.map(async (image) => {
					const { url, originalFilename } = await uploadImage(image);
					return { url, originalFilename };
				})
			);

			// Create form data manually
			const formData = new FormData();
			const fields = [
				{ id: "body", value: body },
				{ id: "description", value: description },
				{ id: "location.country", value: country },
				{ id: "location.region", value: region },
				{
					id: "location.localArea",
					value: (document.getElementById("localArea") as HTMLInputElement)
						.value,
				},
				{
					id: "location.objective",
					value: (document.getElementById("objective") as HTMLInputElement)
						.value,
				},
				{
					id: "distance",
					value: (document.getElementById("distance") as HTMLInputElement)
						.value,
				},
				{
					id: "elevationGain",
					value: (document.getElementById("elevationGain") as HTMLInputElement)
						.value,
				},
				{
					id: "elevationLoss",
					value: (document.getElementById("elevationLoss") as HTMLInputElement)
						.value,
				},
				{
					id: "duration",
					value: (document.getElementById("duration") as HTMLInputElement)
						.value,
				},
				{
					id: "startDate",
					value: (document.getElementById("startDate") as HTMLInputElement)
						.value,
				},
				{
					id: "endDate",
					value: (document.getElementById("endDate") as HTMLInputElement).value,
				},
				{
					id: "title",
					value: (document.getElementById("title") as HTMLInputElement).value,
				},
			];

			fields.forEach((field) => formData.append(field.id, field.value));

			formData.append("imageUrls", JSON.stringify(uploadedImages));

			const activityTypes = Array.from(
				document.querySelectorAll("input[name='activityType']:checked")
			).map((input) => (input as HTMLInputElement).value);
			activityTypes.forEach((type) => formData.append("activityType", type));

			if (gpxFile) {
				formData.append("gpxFile", gpxFile);
			}

			const caltopoUrl = (
				document.getElementById("caltopoUrl") as HTMLInputElement
			).value;
			if (caltopoUrl) {
				formData.append("caltopoUrl", caltopoUrl);
			}

			// Submit form data to the server action
			await addReport(formData);

			// Handle success
			toast.success("Report added successfully!");
		} catch (error) {
			// Handle specific errors
			if (error instanceof Error) {
				switch (error.message) {
					case "Please ensure the end date is not earlier than the start date.":
						setErrors([
							"End date must be equal to or later than the start date.",
						]);
						toast.error("Please check the start and end dates.");
						break;
					case "You've reached the limit for adding reports. Please try again later.":
						toast.error("Report limit reached. Please try again later.");
						break;
					case "Unable to add report. Please try logging out and back in.":
						toast.error("Session error. Please try logging out and back in.");
						break;
					default:
						toast.error(
							"An error occurred while adding the report. Please check your inputs and try again."
						);
						setErrors(["An unexpected error occurred. Please try again."]);
				}
			} else {
				toast.error("An unexpected error occurred. Please try again.");
				setErrors(["An unexpected error occurred. Please try again."]);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2 className="text-3xl text-center font-semibold mb-6">
				Add Trip Report
			</h2>

			<div className="mb-4">
				<Label htmlFor="activityType" required>
					Activity Type
				</Label>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
					<div>
						<input
							type="checkbox"
							id="activityType_hiking"
							name="activityType"
							value="Hiking"
							className="mr-2"
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
						/>
						<label htmlFor="activityType_packrafting">Packrafting</label>
					</div>
				</div>
			</div>

			<div className="mb-4">
				<Label htmlFor="description" required>
					Description
				</Label>
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
				<Label htmlFor="location" required>
					Location
				</Label>
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
					maxLength={50}
					required
				/>
				<input
					type="text"
					id="objective"
					name="location.objective"
					className="border rounded w-full py-2 px-3"
					placeholder="Objective (specific trail, peak, or climb, etc.)"
					maxLength={50}
					required
				/>
			</div>

			<div className="mb-4 flex flex-wrap -mx-2">
				<div className="w-full sm:w-1/3 px-2 mb-4 sm:mb-0">
					<Label htmlFor="distance" required>
						Distance (miles)
					</Label>
					<input
						type="number"
						id="distance"
						name="distance"
						step="0.1"
						className="border rounded w-full py-2 px-3"
						max={10000}
						required
					/>
				</div>
				<div className="w-full sm:w-1/3 px-2 mb-4 sm:mb-0">
					<Label htmlFor="elevationGain" required>
						Elevation Gain (ft)
					</Label>
					<input
						type="number"
						id="elevationGain"
						name="elevationGain"
						className="border rounded w-full py-2 px-3"
						max={99999}
						required
					/>
				</div>
				<div className="w-full sm:w-1/3 px-2">
					<Label htmlFor="elevationLoss" required>
						Elevation Loss (ft)
					</Label>
					<input
						type="number"
						id="elevationLoss"
						name="elevationLoss"
						className="border rounded w-full py-2 px-3"
						max={99999}
						required
					/>
				</div>
			</div>

			<div className="mb-4">
				<Label htmlFor="duration" required>
					Duration (hours)
				</Label>
				<input
					type="number"
					id="duration"
					name="duration"
					className="border rounded w-full py-2 px-3"
					step="0.1"
					max={1000}
					required
				/>
			</div>

			<div className="mb-4">
				<Label htmlFor="startDate" required>
					Start Date
				</Label>
				<input
					type="date"
					id="startDate"
					name="startDate"
					className="border rounded w-full py-2 px-3"
					value={startDate}
					onChange={handleStartDateChange}
					required
				/>
			</div>

			<div className="mb-4">
				<Label htmlFor="endDate" required>
					End Date
				</Label>
				<input
					type="date"
					id="endDate"
					name="endDate"
					className="border rounded w-full py-2 px-3"
					value={endDate}
					onChange={handleEndDateChange}
					required
				/>
			</div>

			<div className="mb-4">
				<label htmlFor="gpxFile" className="block text-gray-700 font-bold mb-2">
					Upload GPX File
				</label>
				<input
					type="file"
					id="gpxFile"
					name="gpxFile"
					className="border rounded w-full py-2 px-3"
					accept=".gpx"
					onChange={handleGpxFileChange}
				/>
				{gpxFile && (
					<div className="mt-2">
						<span>{gpxFile.name}</span>
						<button
							type="button"
							className="ml-2 text-red-500"
							onClick={removeGpxFile}
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
					Caltopo URL
				</label>
				<input
					type="url"
					id="caltopoUrl"
					name="caltopoUrl"
					className="border rounded w-full py-2 px-3"
					placeholder="e.g. https://caltopo.com/m/EH41"
					maxLength={100}
				/>
			</div>

			<div className="mb-4">
				<Label htmlFor="title" required>
					Title
				</Label>
				<input
					type="text"
					id="title"
					name="title"
					className="border rounded w-full py-2 px-3 mb-2"
					placeholder="Enter a title for your trip report"
					maxLength={75}
					required
				/>
			</div>

			<div className="mb-4">
				<Label htmlFor="body" required>
					Trip Report
				</Label>
				<input type="hidden" name="body" value={body} />
				<div className="border rounded">
					<ReportBodyEditor onChange={handleBodyChange} />
				</div>
			</div>

			<div className="mb-4">
				<label htmlFor="images" className="block text-gray-700 font-bold mb-2">
					Images (max 10)
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
				<SubmitButton
					isSubmitting={isSubmitting}
					text="Add Report"
					pendingText="Adding Report..."
				/>
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

export default ReportAddForm;
