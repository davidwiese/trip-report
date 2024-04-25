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
		subject: {
			type: String,
			required: [true, "Subject is required"],
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

// Add indexes for frequently queried fields
MessageSchema.index({ sender: 1, recipient: 1 });
MessageSchema.index({ read: 1 });

// Prevent creation of multiple instances of the same model
const Message = models.Message || model("Message", MessageSchema);

export default Message;
