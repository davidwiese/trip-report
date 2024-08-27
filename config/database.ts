import Message from "@/models/Message";
import Report from "@/models/Report";
import User from "@/models/User";
import mongoose from "mongoose";

const options = {
	bufferCommands: false, // Disable mongoose buffering
	socketTimeoutMS: 45000, // Close sockets after 45s
	serverSelectionTimeoutMS: 5000, // Timeout after 5s
};

let connectionAttempts = 0;

const connectDB = async () => {
	const timestamp = new Date().toISOString();
	console.log(`[${timestamp}] Connection attempt ${++connectionAttempts}`);
	console.log(
		`[${timestamp}] MongoDB connection state: ${mongoose.connection.readyState}`
	);
	// Only fields specified in our schema will be saved to the db
	mongoose.set("strictQuery", true);
	console.log(
		`MongoDB connection state on function start: ${mongoose.connection.readyState}`
	);
	// Since we're using Next API serverless functions, check mongoose connection state
	// 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
	if (mongoose.connection.readyState === 1) {
		console.log("MongoDB is already connected...");
		return;
	}

	if (mongoose.connection.readyState >= 2) {
		console.log(
			`[${timestamp}] MongoDB connection is currently in progress...`
		);
		await new Promise<void>((resolve, reject) => {
			const timeout = setTimeout(() => {
				reject(new Error("Connection attempt timed out"));
			}, 10000); // 10 second timeout

			const onConnected = () => {
				clearTimeout(timeout);
				console.log(
					"MongoDB connection successfully established during in-progress state."
				);
				mongoose.connection.off("error", onError);
				mongoose.connection.off("disconnected", onDisconnected);
				resolve();
			};
			const onError = (err: Error) => {
				clearTimeout(timeout);
				console.error(
					`[${new Date().toISOString()}] Error occurred during MongoDB connection attempt:`,
					err
				);
				mongoose.connection.off("connected", onConnected);
				mongoose.connection.off("disconnected", onDisconnected);
				reject(err);
			};
			const onDisconnected = () => {
				clearTimeout(timeout);
				console.error(
					`[${new Date().toISOString()}] MongoDB connection was disconnected during an attempt.`
				);
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

	// Use MONGODB_URI_DEV if it's set, otherwise fall back to MONGODB_URI
	const mongoURI =
		process.env.NODE_ENV === "production"
			? process.env.MONGODB_URI
			: process.env.MONGODB_URI_DEV || process.env.MONGODB_URI;

	console.log(
		`[${timestamp}] Attempting to connect to MongoDB with URI: ${mongoURI}`
	);

	if (!mongoURI) {
		console.error(`[${timestamp}] MongoDB URI is not defined.`);
		throw new Error("MongoDB connection URI is not defined.");
	}

	try {
		await mongoose.connect(mongoURI, options);
		console.log(`[${timestamp}] MongoDB connected successfully.`);
	} catch (err) {
		console.error(`[${timestamp}] Error connecting to MongoDB:`, err);
		throw err;
	}
};

// Explicitly register models
mongoose.model("User", User.schema);
mongoose.model("Report", Report.schema);
mongoose.model("Message", Message.schema);

// Add global event listeners
mongoose.connection.on("connected", () => {
	console.log(
		`[${new Date().toISOString()}] Mongoose global event: connected to DB.`
	);
});

mongoose.connection.on("error", (err) => {
	console.error(
		`[${new Date().toISOString()}] Mongoose global event: connection error:`,
		err
	);
});

mongoose.connection.on("disconnected", () => {
	console.log(
		`[${new Date().toISOString()}] Mongoose global event: disconnected from DB.`
	);
});

export default connectDB;
