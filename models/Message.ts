import { Schema, model, models } from "mongoose";

const MessageSchema = new Schema(
	{
		sender: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		recipient: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		report: {
			type: Schema.Types.ObjectId,
			ref: "Report",
			required: true,
		},
		name: {
			type: String,
			required: [true, "Name is required"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
		},
		phone: {
			type: String,
		},
		body: {
			type: String,
			required: [true, "Message is required"],
		},
		read: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

// Prevent creation of multiple instances of the same model
const Message = models.Message || model("Message", MessageSchema);

export default Message;
