import { Schema, model, models } from "mongoose";

const ReportSchema = new Schema(
	{
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		activityType: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		location: {
			type: String,
			required: true,
		},
		distance: {
			type: Number,
			required: true,
		},
		elevationGain: {
			type: Number,
			required: true,
		},
		elevationLoss: {
			type: Number,
			required: true,
		},
		duration: {
			type: Number,
			required: true,
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
			validate: {
				validator: function (this: any, value: Date): boolean {
					return this.startDate <= value;
				},
				message: "End date must be equal to or later than the start date.",
			},
		},
		// NOTE: Limit the user to a maximum of 4 images
		images: {
			type: [String],
			validate: {
				validator: (v: string[]) => v.length <= 4,
				message: (props: { value: string[] }) =>
					`The images array can contain a maximum of 4 images, but has ${props.value.length}`,
			},
		},
		isFeatured: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

// Prevent creation of multiple instances of the same model
const Report = models.Report || model("Report", ReportSchema);

export default Report;
