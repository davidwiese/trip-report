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
		images: [
			{
				type: String,
			},
		],
		isFeatured: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const Report = models.Report || model("Report", ReportSchema);

export default Report;
