import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
	{
		email: {
			type: String,
			unique: [true, "Email already exists"],
			required: [true, "Email is required"],
		},
		username: {
			type: String,
			required: [true, "Username is required"],
		},
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

// Prevent creation of multiple instances of the same model
const User = mongoose.model("User") || mongoose.model("User", UserSchema);

export default User;
