import { Schema, model, models } from "mongoose";

const ReportSchema = new Schema(
	{
		owner: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		location: {
			street: {
				type: String,
			},
			city: {
				type: String,
				required: true,
			},
			state: {
				type: String,
				required: true,
			},
			zipcode: {
				type: String,
			},
		},
		beds: {
			type: Number,
			required: true,
		},
		baths: {
			type: Number,
			required: true,
		},
		square_feet: {
			type: Number,
			required: true,
		},
		amenities: [
			{
				type: String,
			},
		],
		rates: {
			nightly: {
				type: Number,
			},
			weekly: {
				type: Number,
			},
			monthly: {
				type: Number,
			},
		},
		seller_info: {
			name: {
				type: String,
			},
			email: {
				type: String,
				required: true,
			},
			phone: {
				type: String,
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
