import Label from "@/components/Label";

export const ACTIVITY_TYPES = [
	"Hiking",
	"Backpacking",
	"Trail Running",
	"Rock Climbing",
	"Sport Climbing",
	"Trad Climbing",
	"Aid Climbing",
	"Ice Climbing",
	"Mixed Climbing",
	"Mountaineering",
	"Ski Touring",
	"Ski Mountaineering",
	"Canyoneering",
	"Mountain Biking",
	"Cycling",
	"Bikepacking",
	"Kayaking",
	"Packrafting",
] as const;

interface ActivityTypeSelectorProps {
	selectedActivities: string[];
	onChange: (activities: string[]) => void;
}

const ActivityTypeSelector = ({
	selectedActivities,
	onChange,
}: ActivityTypeSelectorProps) => {
	const handleActivityChange = (activity: string) => {
		const newSelected = selectedActivities.includes(activity)
			? selectedActivities.filter((a) => a !== activity)
			: [...selectedActivities, activity];
		onChange(newSelected);
	};

	return (
		<div className="mb-4">
			<Label htmlFor="activityType" required>
				Activity Type
			</Label>
			<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
				{ACTIVITY_TYPES.map((activity) => (
					<div key={activity} className="flex items-center space-x-1">
						<input
							type="checkbox"
							id={`activityType_${activity.replace(/\s+/g, "")}`}
							name="activityType"
							value={activity}
							checked={selectedActivities.includes(activity)}
							onChange={() => handleActivityChange(activity)}
							className="md:mr-2"
						/>
						<label
							htmlFor={`activityType_${activity.replace(/\s+/g, "")}`}
							className="whitespace-nowrap text-xs md:text-base"
						>
							{activity}
						</label>
					</div>
				))}
			</div>
		</div>
	);
};

export default ActivityTypeSelector;
