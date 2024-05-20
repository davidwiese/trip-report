import { Schema, model, models } from "mongoose";

const RatingSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		report: {
			type: Schema.Types.ObjectId,
			ref: "Report",
			required: true,
		},
		rating: {
			type: Number,
			required: true,
			min: 1,
			max: 5,
		},
	},
	{ _id: false, timestamps: true }
);

RatingSchema.index({ user: 1, report: 1 }, { unique: true });

const ImageSchema = new Schema(
	{
		url: { type: String, required: true },
		originalFilename: { type: String, required: true },
	},
	{ _id: false }
);

const GpxKmlFileSchema = new Schema(
	{
		url: { type: String, required: true },
		originalFilename: { type: String, required: true },
	},
	{ _id: false }
);

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
			type: [String],
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
		location: {
			country: {
				type: String,
				required: true,
			},
			region: {
				type: String,
				required: true,
			},
			localArea: {
				type: String,
				required: true,
			},
			objective: {
				type: String,
				required: true,
			},
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
		gpxKmlFile: GpxKmlFileSchema,
		caltopoUrl: {
			type: String,
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
		// NOTE: Limit the user to a maximum of 5 images
		images: {
			type: [ImageSchema],
			default: undefined,
			validate: {
				validator: (v: Array<{ url: string; originalFilename: string }>) =>
					v.length <= 5,
				message: (props: {
					value: Array<{ url: string; originalFilename: string }>;
				}) =>
					`The images array can contain a maximum of 5 images, but has ${props.value.length}`,
			},
		},
		isFeatured: {
			type: Boolean,
			default: false,
		},
		ratings: [RatingSchema],
		averageRating: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

ReportSchema.index({ owner: 1 });
ReportSchema.index({ activityType: 1 });
ReportSchema.index({ location: "text" });
ReportSchema.index({ startDate: 1 });
ReportSchema.index({ endDate: 1 });
ReportSchema.index({ averageRating: -1 });

// Prevent creation of multiple instances of the same model
const Report = models.Report || model("Report", ReportSchema);

export default Report;
