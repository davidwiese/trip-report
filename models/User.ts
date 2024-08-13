import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
	{
		clerkId: {
			type: String,
			unique: true,
			required: true,
		},
		email: {
			type: String,
			unique: [true, "Email already exists"],
			required: [true, "Email is required"],
		},
		username: {
			type: String,
			required: [true, "Username is required"],
		},
		bio: {
			type: String,
		},
		totalReports: {
			type: Number,
			default: 0,
		},
		totalDistance: {
			type: Number,
			default: 0,
		},
		totalElevationGain: {
			type: Number,
			default: 0,
		},
		totalElevationLoss: {
			type: Number,
			default: 0,
		},
		reports: [
			{
				type: Schema.Types.ObjectId,
				ref: "Report",
			},
		],
		image: {
			type: String,
		},
		bookmarks: [
			{
				type: Schema.Types.ObjectId,
				ref: "Report",
			},
		],
	},
	{
		timestamps: true,
	}
);

UserSchema.index({ username: 1 });
UserSchema.index({ clerkId: 1 });

// Prevent creation of multiple instances of the same model
const User = models.User || model("User", UserSchema);

export default User;
