"use client";
import addReport from "@/app/actions/addReport";
import { ChangeEvent } from "react";
import { toast } from "react-toastify";
import SubmitButton from "@/components/SubmitButton";

type ReportAddFormProps = {
	// Add any props here if needed
};

const ReportAddForm: React.FC<ReportAddFormProps> = () => {
	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 4) {
			e.target.value = "";
			toast.error("You can select up to 4 images");
		}
	};

	// NOTE: this component has been changed to use a server action so we no
	// longer need an API route handler for a POST at app/api/reports/route.js

	return (
		<form action={addReport}>
			<h2 className="text-3xl text-center font-semibold mb-6">
				Add Trip Report
			</h2>

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
				/>
			</div>

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
					required
				></textarea>
			</div>

			<div className="mb-4">
				<label
					htmlFor="location"
					className="block text-gray-700 font-bold mb-2"
				>
					Location
				</label>
				<input
					type="text"
					id="location"
					name="location"
					className="border rounded w-full py-2 px-3 mb-2"
					placeholder="Enter the location of your trip"
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
					required
				/>
			</div>

			<div className="mb-4">
				<label htmlFor="body" className="block text-gray-700 font-bold mb-2">
					Trip Report
				</label>
				<input type="hidden" name="body" />
				<p>RICH TEXT EDITOR</p>
			</div>

			<div className="mb-4">
				<label htmlFor="images" className="block text-gray-700 font-bold mb-2">
					Images (Select up to 4 images)
				</label>
				<input
					type="file"
					id="images"
					name="images"
					className="border rounded w-full py-2 px-3"
					accept="image/*"
					multiple
					onChange={handleImageChange}
					required
				/>
			</div>

			<div>
				<SubmitButton />
			</div>
		</form>
	);
};

export default ReportAddForm;
