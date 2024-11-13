"use client";

import updateReport from "@/app/actions/updateReport";
import Label from "@/components/Label";
import ReportBodyEditor from "@/components/ReportBodyEditor";
import SubmitButton from "@/components/SubmitButton";
import { Report as ReportType } from "@/types";
import { uploadImage } from "@/utils/cloudinaryUploader";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { toast } from "react-toastify";

type ReportEditFormProps = {
	report: ReportType;
};

type ImageObject = {
	url: string;
	originalFilename: string;
};

const ReportEditForm: React.FC<ReportEditFormProps> = ({ report }) => {
	const [title, setTitle] = useState<string>(report.title || "");
	const [distance, setDistance] = useState<string>(
		report.distance?.toString() || ""
	);
	const [elevationGain, setElevationGain] = useState<string>(
		report.elevationGain?.toString() || ""
	);
	const [elevationLoss, setElevationLoss] = useState<string>(
		report.elevationLoss?.toString() || ""
	);
	const [duration, setDuration] = useState<string>(
		report.duration?.toString() || ""
	);
	const [caltopoUrl, setCaltopoUrl] = useState<string>(report.caltopoUrl || "");
	const [localArea, setLocalArea] = useState<string>(
		report.location.localArea || ""
	);
	const [objective, setObjective] = useState<string>(
		report.location.objective || ""
	);
	const [activityTypes, setActivityTypes] = useState<string[]>(
		report.activityType || []
	);
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
	const [isRedirecting, setIsRedirecting] = useState(false);
	const maxDescriptionLength = 500;
	const router = useRouter();

	useEffect(() => {
		const loadStoredChanges = () => {
			const storedChanges = sessionStorage.getItem(
				`reportEditChanges_${report._id}`
			);
			if (storedChanges) {
				const changes = JSON.parse(storedChanges);
				setTitle(changes.title ?? report.title);
				setBody(changes.body ?? report.body);
				setDescription(changes.description ?? report.description);
				setCountry(changes.country ?? report.location.country);
				setRegion(changes.region ?? report.location.region);
				setStartDate(changes.startDate ?? report.startDate);
				setEndDate(changes.endDate ?? report.endDate);
				setActivityTypes(changes.activityTypes ?? report.activityType);
				setDistance(changes.distance ?? report.distance?.toString());
				setElevationGain(
					changes.elevationGain ?? report.elevationGain?.toString()
				);
				setElevationLoss(
					changes.elevationLoss ?? report.elevationLoss?.toString()
				);
				setDuration(changes.duration ?? report.duration?.toString());
				setCaltopoUrl(changes.caltopoUrl ?? report.caltopoUrl);
				setLocalArea(changes.localArea ?? report.location.localArea);
				setObjective(changes.objective ?? report.location.objective);
			}
		};

		loadStoredChanges();
		window.addEventListener("popstate", loadStoredChanges);
		return () => {
			window.removeEventListener("popstate", loadStoredChanges);
		};
	}, [report]);

	// Save changes to sessionStorage when fields are modified
	useEffect(() => {
		const changes = {
			title,
			body,
			description,
			country,
			region,
			startDate,
			endDate,
			activityTypes,
			distance,
			elevationGain,
			elevationLoss,
			duration,
			caltopoUrl,
			localArea,
			objective,
		};

		const hasChanges = (
			originalReport: ReportType,
			currentChanges: typeof changes
		): boolean => {
			if (currentChanges.title !== originalReport.title) return true;
			if (currentChanges.body !== originalReport.body) return true;
			if (currentChanges.description !== originalReport.description)
				return true;
			if (currentChanges.country !== originalReport.location.country)
				return true;
			if (currentChanges.region !== originalReport.location.region) return true;
			if (currentChanges.localArea !== originalReport.location.localArea)
				return true;
			if (currentChanges.objective !== originalReport.location.objective)
				return true;
			if (currentChanges.distance !== originalReport.distance?.toString())
				return true;
			if (
				currentChanges.elevationGain !==
				originalReport.elevationGain?.toString()
			)
				return true;
			if (
				currentChanges.elevationLoss !==
				originalReport.elevationLoss?.toString()
			)
				return true;
			if (currentChanges.duration !== originalReport.duration?.toString())
				return true;
			if (currentChanges.caltopoUrl !== originalReport.caltopoUrl) return true;
			if (
				JSON.stringify(currentChanges.activityTypes) !==
				JSON.stringify(originalReport.activityType)
			)
				return true;

			// Handle dates
			const formattedStartDate = originalReport.startDate
				? new Date(originalReport.startDate).toISOString().split("T")[0]
				: "";
			const formattedEndDate = originalReport.endDate
				? new Date(originalReport.endDate).toISOString().split("T")[0]
				: "";
			if (currentChanges.startDate !== formattedStartDate) return true;
			if (currentChanges.endDate !== formattedEndDate) return true;

			return false;
		};

		if (hasChanges(report, changes)) {
			sessionStorage.setItem(
				`reportEditChanges_${report._id}`,
				JSON.stringify(changes)
			);
		}
	}, [
		report,
		title,
		body,
		description,
		country,
		region,
		startDate,
		endDate,
		activityTypes,
		distance,
		elevationGain,
		elevationLoss,
		duration,
		caltopoUrl,
		localArea,
		objective,
	]);

	// Event handlers
	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	};

	const handleBodyChange = (content: string) => {
		setBody(content);
	};

	const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setDescription(e.target.value);
	};

	const handleCountryChange = (val: string) => {
		setCountry(val);
	};

	const handleRegionChange = (val: string) => {
		setRegion(val);
	};

	const handleLocalAreaChange = (e: ChangeEvent<HTMLInputElement>) => {
		setLocalArea(e.target.value);
	};

	const handleObjectiveChange = (e: ChangeEvent<HTMLInputElement>) => {
		setObjective(e.target.value);
	};

	const handleDistanceChange = (e: ChangeEvent<HTMLInputElement>) => {
		setDistance(e.target.value);
	};

	const handleElevationGainChange = (e: ChangeEvent<HTMLInputElement>) => {
		setElevationGain(e.target.value);
	};

	const handleElevationLossChange = (e: ChangeEvent<HTMLInputElement>) => {
		setElevationLoss(e.target.value);
	};

	const handleDurationChange = (e: ChangeEvent<HTMLInputElement>) => {
		setDuration(e.target.value);
	};

	const handleCaltopoUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
		setCaltopoUrl(e.target.value);
	};

	const handleActivityTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
		setActivityTypes((prev) => {
			if (e.target.checked) {
				return [...prev, e.target.value];
			} else {
				return prev.filter((type) => type !== e.target.value);
			}
		});
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

	const toggleRemoveImage = (image: ImageObject) => {
		setRemoveImages((prevRemoveImages) => {
			if (prevRemoveImages.some((img) => img.url === image.url)) {
				return prevRemoveImages.filter((img) => img.url !== image.url);
			} else {
				return [...prevRemoveImages, image];
			}
		});
	};

	const stripHtml = (html: string) => {
		const tmp = document.createElement("div");
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || "";
	};

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
		if (
			!(document.getElementById("location.localArea") as HTMLInputElement).value
		) {
			newErrors.push("Local area is required");
		}
		if (
			!(document.getElementById("location.objective") as HTMLInputElement).value
		) {
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
		if (!stripHtml(body).trim()) {
			newErrors.push("Trip report body cannot be empty");
		}

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

		const existingImageCount = report.images?.length ?? 0;
		const markedForRemovalCount = removeImages.length;
		const newImageCount = images.length;
		const totalImages =
			existingImageCount - markedForRemovalCount + newImageCount;

		if (totalImages > 10) {
			newErrors.push("You can select up to 10 images in total");
		}

		setErrors(newErrors);
		return newErrors.length === 0;
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isSubmitting || isRedirecting) return;

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
			const result = await updateReport(report._id, formData);

			if (result.success && result.reportId) {
				sessionStorage.removeItem(`reportEditChanges_${report._id}`);
				toast.success("Report updated successfully!");
				setIsRedirecting(true);
				router.push(`/reports/${result.reportId}`);
			} else {
				toast.error(
					result.error || "Failed to update report. Please try again."
				);
				setErrors([
					result.error || "Failed to update report. Please try again.",
				]);
			}
		} catch (error) {
			console.error("Error updating report:", error);
			toast.error("An unexpected error occurred. Please try again.");
			setErrors(["An unexpected error occurred. Please try again."]);
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
				<Label htmlFor="activityType" required>
					Activity Type
				</Label>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
					<div className="flex items-center space-x-1">
						<input
							type="checkbox"
							id="activityType_hiking"
							name="activityType"
							value="Hiking"
							checked={activityTypes.includes("Hiking")}
							onChange={handleActivityTypeChange}
							className="md:mr-2"
						/>
						<label
							htmlFor="activityType_hiking"
							className="whitespace-nowrap text-xs sm:text-base"
						>
							Hiking
						</label>
					</div>
					<div className="flex items-center space-x-1">
						<input
							type="checkbox"
							id="activityType_backpacking"
							name="activityType"
							value="Backpacking"
							checked={activityTypes.includes("Backpacking")}
							onChange={handleActivityTypeChange}
							className="md:mr-2"
						/>
						<label
							htmlFor="activityType_backpacking"
							className="whitespace-nowrap text-xs sm:text-base"
						>
							Backpacking
						</label>
					</div>
					<div className="flex items-center space-x-1">
						<input
							type="checkbox"
							id="activityType_trailRunning"
							name="activityType"
							value="Trail Running"
							checked={activityTypes.includes("Trail Running")}
							onChange={handleActivityTypeChange}
							className="md:mr-2"
						/>
						<label
							htmlFor="activityType_trailRunning"
							className="whitespace-nowrap text-xs sm:text-base"
						>
							Trail Running
						</label>
					</div>
					<div className="flex items-center space-x-1">
						<input
							type="checkbox"
							id="activityType_rockClimbing"
							name="activityType"
							value="Rock Climbing"
							checked={activityTypes.includes("Rock Climbing")}
							onChange={handleActivityTypeChange}
							className="md:mr-2"
						/>
						<label
							htmlFor="activityType_rockClimbing"
							className="whitespace-nowrap text-xs sm:text-base"
						>
							Rock Climbing
						</label>
					</div>
					<div className="flex items-center space-x-1">
						<input
							type="checkbox"
							id="activityType_sportClimbing"
							name="activityType"
							value="Sport Climbing"
							checked={activityTypes.includes("Sport Climbing")}
							onChange={handleActivityTypeChange}
							className="md:mr-2"
						/>
						<label
							htmlFor="activityType_sportClimbing"
							className="whitespace-nowrap text-xs sm:text-base"
						>
							Sport Climbing
						</label>
					</div>
					<div className="flex items-center space-x-1">
						<input
							type="checkbox"
							id="activityType_tradClimbing"
							name="activityType"
							value="Trad Climbing"
							checked={activityTypes.includes("Trad Climbing")}
							onChange={handleActivityTypeChange}
							className="md:mr-2"
						/>
						<label
							htmlFor="activityType_tradClimbing"
							className="whitespace-nowrap text-xs sm:text-base"
						>
							Trad Climbing
						</label>
					</div>
					<div className="flex items-center space-x-1">
						<input
							type="checkbox"
							id="activityType_aidClimbing"
							name="activityType"
							value="Aid Climbing"
							checked={activityTypes.includes("Aid Climbing")}
							onChange={handleActivityTypeChange}
							className="md:mr-2"
						/>
						<label
							htmlFor="activityType_aidClimbing"
							className="whitespace-nowrap text-xs sm:text-base"
						>
							Aid Climbing
						</label>
					</div>
					<div className="flex items-center space-x-1">
						<input
							type="checkbox"
							id="activityType_iceClimbing"
							name="activityType"
							value="Ice Climbing"
							checked={activityTypes.includes("Ice Climbing")}
							onChange={handleActivityTypeChange}
							className="md:mr-2"
						/>
						<label
							htmlFor="activityType_iceClimbing"
							className="whitespace-nowrap text-xs sm:text-base"
						>
							Ice Climbing
						</label>
					</div>
					<div className="flex items-center space-x-1">
						<input
							type="checkbox"
							id="activityType_mixedClimbing"
							name="activityType"
							value="Mixed Climbing"
							checked={activityTypes.includes("Mixed Climbing")}
							onChange={handleActivityTypeChange}
							className="md:mr-2"
						/>
						<label
							htmlFor="activityType_mixedClimbing"
							className="whitespace-nowrap text-xs sm:text-base"
						>
							Mixed Climbing
						</label>
					</div>
					<div className="flex items-center space-x-1">
						<input
							type="checkbox"
							id="activityType_mountaineering"
							name="activityType"
							value="Mountaineering"
							checked={activityTypes.includes("Mountaineering")}
							onChange={handleActivityTypeChange}
							className="md:mr-2"
						/>
						<label
							htmlFor="activityType_mountaineering"
							className="whitespace-nowrap text-xs sm:text-base"
						>
							Mountaineering
						</label>
					</div>
					<div className="flex items-center space-x-1">
						<input
							type="checkbox"
							id="activityType_skiTouring"
							name="activityType"
							value="Ski Touring"
							checked={activityTypes.includes("Ski Touring")}
							onChange={handleActivityTypeChange}
							className="md:mr-2"
						/>
						<label
							htmlFor="activityType_skiTouring"
							className="whitespace-nowrap text-xs sm:text-base"
						>
							Ski Touring
						</label>
					</div>
					<div className="flex items-center space-x-1">
						<input
							type="checkbox"
							id="activityType_skiMountaineering"
							name="activityType"
							value="Ski Mountaineering"
							checked={activityTypes.includes("Ski Mountaineering")}
							onChange={handleActivityTypeChange}
							className="md:mr-2"
						/>
						<label
							htmlFor="activityType_skiMountaineering"
							className="whitespace-nowrap text-xs sm:text-base"
						>
							Ski Mountaineering
						</label>
					</div>
					<div className="flex items-center space-x-1">
						<input
							type="checkbox"
							id="activityType_canyoneering"
							name="activityType"
							value="Canyoneering"
							checked={activityTypes.includes("Canyoneering")}
							onChange={handleActivityTypeChange}
							className="md:mr-2"
						/>
						<label
							htmlFor="activityType_canyoneering"
							className="whitespace-nowrap text-xs sm:text-base"
						>
							Canyoneering
						</label>
					</div>
					<div className="flex items-center space-x-1">
						<input
							type="checkbox"
							id="activityType_mountainBiking"
							name="activityType"
							value="Mountain Biking"
							checked={activityTypes.includes("Mountain Biking")}
							onChange={handleActivityTypeChange}
							className="md:mr-2"
						/>
						<label
							htmlFor="activityType_mountainBiking"
							className="whitespace-nowrap text-xs sm:text-base"
						>
							Mountain Biking
						</label>
					</div>
					<div className="flex items-center space-x-1">
						<input
							type="checkbox"
							id="activityType_cycling"
							name="activityType"
							value="Cycling"
							checked={activityTypes.includes("Cycling")}
							onChange={handleActivityTypeChange}
							className="md:mr-2"
						/>
						<label
							htmlFor="activityType_cycling"
							className="whitespace-nowrap text-xs sm:text-base"
						>
							Cycling
						</label>
					</div>
					<div className="flex items-center space-x-1">
						<input
							type="checkbox"
							id="activityType_bikepacking"
							name="activityType"
							value="Bikepacking"
							checked={activityTypes.includes("Bikepacking")}
							onChange={handleActivityTypeChange}
							className="md:mr-2"
						/>
						<label
							htmlFor="activityType_bikepacking"
							className="whitespace-nowrap text-xs sm:text-base"
						>
							Bikepacking
						</label>
					</div>
					<div className="flex items-center space-x-1">
						<input
							type="checkbox"
							id="activityType_kayaking"
							name="activityType"
							value="Kayaking"
							checked={activityTypes.includes("Kayaking")}
							onChange={handleActivityTypeChange}
							className="md:mr-2"
						/>
						<label
							htmlFor="activityType_kayaking"
							className="whitespace-nowrap text-xs sm:text-base"
						>
							Kayaking
						</label>
					</div>
					<div className="flex items-center space-x-1">
						<input
							type="checkbox"
							id="activityType_packrafting"
							name="activityType"
							value="Packrafting"
							checked={activityTypes.includes("Packrafting")}
							onChange={handleActivityTypeChange}
							className="md:mr-2"
						/>
						<label
							htmlFor="activityType_packrafting"
							className="whitespace-nowrap text-xs sm:text-base"
						>
							Packrafting
						</label>
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
					className="border rounded w-full py-2 px-3 dark:text-white"
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
					classes="border rounded w-full py-2 px-3 mb-2 dark:text-white"
				/>
				<RegionDropdown
					country={country}
					value={region}
					onChange={handleRegionChange}
					disableWhenEmpty={true}
					blankOptionLabel="Select Region"
					classes="border rounded w-full py-2 px-3 mb-2 dark:text-white"
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
					className="border rounded w-full py-2 px-3 mb-2 dark:text-white"
					placeholder="Local area (mountain range, park, etc.)"
					maxLength={50}
					required
					value={localArea}
					onChange={handleLocalAreaChange}
				/>
				<input
					type="text"
					id="location.objective"
					name="location.objective"
					className="border rounded w-full py-2 px-3 dark:text-white"
					placeholder="Objective (specific trail, peak, or climb, etc.)"
					maxLength={50}
					required
					value={objective}
					onChange={handleObjectiveChange}
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
						className="border rounded w-full py-2 px-3 dark:text-white"
						max={10000}
						required
						value={distance}
						onChange={handleDistanceChange}
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
						className="border rounded w-full py-2 px-3 dark:text-white"
						max={99999}
						required
						value={elevationGain}
						onChange={handleElevationGainChange}
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
						className="border rounded w-full py-2 px-3 dark:text-white"
						max={99999}
						required
						value={elevationLoss}
						onChange={handleElevationLossChange}
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
					className="border rounded w-full py-2 px-3 dark:text-white"
					step="0.1"
					max={1000}
					value={duration}
					onChange={handleDurationChange}
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
					className="border rounded w-full py-2 px-3 dark:text-white"
					required
					value={startDate}
					onChange={(e) => setStartDate(e.target.value)}
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
					className="border rounded w-full py-2 px-3 dark:text-white"
					required
					value={endDate}
					onChange={(e) => setEndDate(e.target.value)}
				/>
			</div>

			<div className="mb-4">
				<label htmlFor="gpxFile" className="block text-gray-700 font-bold mb-2">
					Upload GPX File
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
					accept=".gpx"
					className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
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
					className="border rounded w-full py-2 px-3 dark:text-white"
					placeholder="e.g. https://caltopo.com/m/EH41"
					maxLength={100}
					value={caltopoUrl}
					onChange={handleCaltopoUrlChange}
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
					className="border rounded w-full py-2 px-3 mb-2 dark:text-white"
					placeholder="Enter a title for your trip report"
					maxLength={75}
					required
					value={title}
					onChange={handleTitleChange}
				/>
			</div>

			<div className="mb-4">
				<Label htmlFor="body" required>
					Trip Report
				</Label>
				<input type="hidden" name="body" value={body} />
				<ReportBodyEditor initialValue={body} onChange={handleBodyChange} />
			</div>

			<div className="mb-4">
				<label htmlFor="images" className="block text-gray-700 font-bold mb-2">
					Images (max 10)
				</label>
				<input
					type="file"
					id="images"
					name="images"
					className="border rounded w-full py-2 px-3 text-xs md:text-base"
					accept="image/*,.heic,.heif"
					multiple
					onChange={handleImageChange}
				/>
				{(report.images ?? []).length > 0 && (
					<div className="mt-2">
						<ul>
							{(report.images ?? []).map((image) => (
								<li
									key={image.url}
									className="flex items-center text-xs md:text-base"
								>
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
					isSubmitting={isSubmitting || isRedirecting}
					text="Update Report"
					pendingText={isRedirecting ? "Redirecting..." : "Updating Report..."}
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
