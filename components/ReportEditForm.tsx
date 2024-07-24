"use client";

import updateReport from "@/app/actions/updateReport";
import { ChangeEvent, useState, FormEvent } from "react";
import { uploadImage } from "@/utils/cloudinaryUploader";
import { toast } from "react-toastify";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import ReportBodyEditor from "@/components/ReportBodyEditor";
import SubmitButton from "@/components/SubmitButton";
import { Report as ReportType } from "@/types";

type ReportEditFormProps = {
	report: ReportType;
};

type ImageObject = {
	url: string;
	originalFilename: string;
};

const ReportEditForm: React.FC<ReportEditFormProps> = ({ report }) => {
	const [body, setBody] = useState<string>(report.body || "");
	const [description, setDescription] = useState<string>(
		report.description || ""
	);
	const [country, setCountry] = useState(report.location.country || "");
	const [region, setRegion] = useState(report.location.region || "");
	const [startDate, setStartDate] = useState(
		report.startDate
			? new Date(report.startDate).toISOString().split("T")[0]
			: ""
	);
	const [endDate, setEndDate] = useState(
		report.endDate ? new Date(report.endDate).toISOString().split("T")[0] : ""
	);
	const [errors, setErrors] = useState<string[]>([]);
	const [gpxFile, setGpxFile] = useState<File | null>(null);
	const [removeGpx, setRemoveGpx] = useState<boolean>(false); // Track removal state
	const [images, setImages] = useState<File[]>([]);
	const [removeImages, setRemoveImages] = useState<ImageObject[]>([]); // Track images marked for removal
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
			setRemoveGpx(false); // Un-mark removal if a new file is selected
		}
	};

	const toggleRemoveGpxFile = () => {
		setRemoveGpx((prev) => !prev);
	};

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const selectedFiles = Array.from(e.target.files);
			const existingImageCount = report.images?.length ?? 0;
			const markedForRemovalCount = removeImages.length;
			const newImageCount = selectedFiles.length;
			const totalImages =
				existingImageCount - markedForRemovalCount + newImageCount;
			const maxFileSize = 5 * 1024 * 1024; // 5 MB

			for (const file of selectedFiles) {
				if (file.size > maxFileSize) {
					toast.error(`${file.name} is too large. Maximum size is 5MB.`);
					setImages([]); // Clear the previously selected images
					e.target.value = ""; // Clear the file input
					return;
				}
			}

			if (totalImages > 5) {
				toast.error("You can select up to 5 images in total");
				setImages([]); // Clear the previously selected images
				e.target.value = ""; // Clear the file input
			} else {
				setImages(selectedFiles);
			}
		}
	};

	const toggleRemoveImage = (image: ImageObject) => {
		setRemoveImages((prevRemoveImages) => {
			if (prevRemoveImages.some((img) => img.url === image.url)) {
				return prevRemoveImages.filter((img) => img.url !== image.url);
			} else {
				return [...prevRemoveImages, image];
			}
		});
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

		const existingImageCount = report.images?.length ?? 0;
		const markedForRemovalCount = removeImages.length;
		const newImageCount = images.length;
		const totalImages =
			existingImageCount - markedForRemovalCount + newImageCount;

		if (totalImages > 5)
			newErrors.push("You can select up to 5 images in total");

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
			// Upload images to Cloudinary and get their URLs
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
					value:
						(document.getElementById("location.localArea") as HTMLInputElement)
							?.value || "",
				},
				{
					id: "location.objective",
					value:
						(document.getElementById("location.objective") as HTMLInputElement)
							?.value || "",
				},
				{
					id: "distance",
					value:
						(document.getElementById("distance") as HTMLInputElement)?.value ||
						"",
				},
				{
					id: "elevationGain",
					value:
						(document.getElementById("elevationGain") as HTMLInputElement)
							?.value || "",
				},
				{
					id: "elevationLoss",
					value:
						(document.getElementById("elevationLoss") as HTMLInputElement)
							?.value || "",
				},
				{
					id: "duration",
					value:
						(document.getElementById("duration") as HTMLInputElement)?.value ||
						"",
				},
				{
					id: "startDate",
					value:
						(document.getElementById("startDate") as HTMLInputElement)?.value ||
						"",
				},
				{
					id: "endDate",
					value:
						(document.getElementById("endDate") as HTMLInputElement)?.value ||
						"",
				},
				{
					id: "title",
					value:
						(document.getElementById("title") as HTMLInputElement)?.value || "",
				},
			];

			fields.forEach((field) => {
				formData.append(field.id, field.value);
			});

			formData.append("imageUrls", JSON.stringify(uploadedImages));

			const activityTypes = Array.from(
				document.querySelectorAll("input[name='activityType']:checked")
			).map((input) => (input as HTMLInputElement).value);
			activityTypes.forEach((type) => {
				formData.append("activityType", type);
			});

			// Add the removeGpxFile field to form data
			formData.append("removeGpxFile", removeGpx.toString());

			// Add the gpxFile field to form data only if a new file is selected
			if (gpxFile && !removeGpx) {
				formData.append("gpxFile", gpxFile);
			}

			// Add the removeImages field to form data if images are marked for removal
			if (removeImages.length > 0) {
				removeImages.forEach((image) => {
					formData.append("imagesToRemove", image.url);
				});
			}

			const caltopoUrl =
				(document.getElementById("caltopoUrl") as HTMLInputElement)?.value ||
				"";
			if (caltopoUrl) {
				formData.append("caltopoUrl", caltopoUrl);
			}

			// Submit form data to the server action
			await updateReport(report._id, formData);

			// Handle success
			toast.success("Report updated successfully!");
		} catch (error) {
			// Handle error
			console.error("Error updating report:", error);
			toast.error(
				`Error updating report. Please try again. ${
					error instanceof Error ? error.message : ""
				}`
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
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
						<label htmlFor="activityType_bikepacking">Bikepacking</label>
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
					id="location.localArea"
					name="location.localArea"
					className="border rounded w-full py-2 px-3 mb-2"
					placeholder="Local area (mountain range, park, etc.)"
					maxLength={50}
					required
					defaultValue={report.location.localArea}
				/>
				<input
					type="text"
					id="location.objective"
					name="location.objective"
					className="border rounded w-full py-2 px-3"
					placeholder="Objective (specific trail, peak, or climb, etc.)"
					maxLength={50}
					required
					defaultValue={report.location.objective}
				/>
			</div>

			<div className="mb-4 flex flex-wrap -mx-2">
				<div className="w-full sm:w-1/3 px-2 mb-4 sm:mb-0">
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
						step="0.1"
						className="border rounded w-full py-2 px-3"
						max={10000}
						required
						defaultValue={report.distance}
					/>
				</div>
				<div className="w-full sm:w-1/3 px-2 mb-4 sm:mb-0">
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
						max={99999}
						required
						defaultValue={report.elevationGain}
					/>
				</div>
				<div className="w-full sm:w-1/3 px-2">
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
						max={99999}
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
					step="0.1"
					max={1000}
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
					value={startDate}
					onChange={(e) => setStartDate(e.target.value)}
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
					value={endDate}
					onChange={(e) => setEndDate(e.target.value)}
				/>
			</div>

			<div className="mb-4">
				<label htmlFor="gpxFile" className="block text-gray-700 font-bold mb-2">
					Upload GPX File (optional)
				</label>
				{report.gpxFile && (
					<div className="flex items-center">
						<a
							href={report.gpxFile.url}
							target="_blank"
							rel="noopener noreferrer"
							className={`${removeGpx ? "line-through text-gray-500" : ""}`}
						>
							{report.gpxFile.originalFilename}
						</a>
						{!removeGpx ? (
							<button
								className="ml-2 text-red-500"
								type="button"
								onClick={toggleRemoveGpxFile}
							>
								Remove File
							</button>
						) : (
							<button
								className="ml-2 text-gray-500"
								type="button"
								onClick={toggleRemoveGpxFile}
							>
								Undo
							</button>
						)}
					</div>
				)}
				<input
					type="file"
					id="gpxFile"
					name="gpxFile"
					onChange={handleGpxFileChange}
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
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
					maxLength={100}
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
					maxLength={75}
					required
					defaultValue={report.title}
				/>
			</div>

			<div className="mb-4">
				<label htmlFor="body" className="block text-gray-700 font-bold mb-2">
					Trip Report
				</label>
				<input type="hidden" name="body" value={body} />
				<div className="border rounded">
					<ReportBodyEditor value={body} onChange={handleBodyChange} />
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
				{(report.images ?? []).length > 0 && (
					<div className="mt-2">
						<ul>
							{(report.images ?? []).map((image) => (
								<li key={image.url} className="flex items-center">
									<a
										href={image.url}
										target="_blank"
										rel="noopener noreferrer"
										className={`${
											removeImages.some((img) => img.url === image.url)
												? "line-through text-gray-500"
												: ""
										}`}
									>
										{image.originalFilename}
									</a>
									{!removeImages.some((img) => img.url === image.url) ? (
										<button
											className="ml-2 text-red-500"
											type="button"
											onClick={() => toggleRemoveImage(image)}
										>
											Remove
										</button>
									) : (
										<button
											className="ml-2 text-gray-500"
											type="button"
											onClick={() => toggleRemoveImage(image)}
										>
											Undo
										</button>
									)}
								</li>
							))}
						</ul>
					</div>
				)}
			</div>

			<div>
				<SubmitButton
					isSubmitting={isSubmitting}
					text="Update Report"
					pendingText="Updating Report..."
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

export default ReportEditForm;
