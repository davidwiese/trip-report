import Message from "@/models/Message";
import Report from "@/models/Report";
import User from "@/models/User";
import mongoose from "mongoose";

const options = {
	bufferCommands: false, // Disable mongoose buffering
	socketTimeoutMS: 45000, // Close sockets after 45s
	serverSelectionTimeoutMS: 5000, // Timeout after 5s
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
		await new Promise<void>((resolve, reject) => {
			const onConnected = () => {
				mongoose.connection.off("error", onError);
				mongoose.connection.off("disconnected", onDisconnected);
				resolve();
			};
			const onError = (err: Error) => {
				mongoose.connection.off("connected", onConnected);
				mongoose.connection.off("disconnected", onDisconnected);
				reject(err);
			};
			const onDisconnected = () => {
				mongoose.connection.off("connected", onConnected);
				mongoose.connection.off("error", onError);
				reject(new Error("Disconnected during connection attempt"));
			};

			mongoose.connection.once("connected", onConnected);
			mongoose.connection.once("error", onError);
			mongoose.connection.once("disconnected", onDisconnected);
		});
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
