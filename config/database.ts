import mongoose from "mongoose";
import User from "@/models/User";
import Report from "@/models/Report";
import Message from "@/models/Message";

const options = {
	bufferCommands: false, // Disable mongoose buffering
};

const connectDB = async () => {
	// Only fields specified in our schema will be saved to the db
	mongoose.set("strictQuery", true);

	// Since we're using Next API serverless functions, check mongoose connection state
	// 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
	if (mongoose.connection.readyState === 1) {
		console.log("MongoDB is already connected...");
		return;
	}

	if (mongoose.connection.readyState >= 2) {
		console.log("MongoDB connection is currently in progress...");
		return;
	}

	// Connect to MongoDB
	const mongoURI = process.env.MONGODB_URI;
	if (!mongoURI) {
		console.error("MongoDB URI is not defined.");
		throw new Error("MongoDB connection URI is not defined.");
	}

	try {
		await mongoose.connect(mongoURI, options);
		console.log("MongoDB connected...");
	} catch (err) {
		console.error("Error connecting to MongoDB:", err);
		throw err;
	}
};

// Explicitly register models
mongoose.model("User", User.schema);
mongoose.model("Report", Report.schema);
mongoose.model("Message", Message.schema);

export default connectDB;
