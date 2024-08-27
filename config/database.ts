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

	// Only log connection attempts if not already connected
	if (mongoose.connection.readyState !== 1) {
		console.log(
			`[${timestamp}] Connection attempt ${++connectionAttempts}. State: ${
				mongoose.connection.readyState
			}`
		);
	}
	// Only fields specified in our schema will be saved to the db
	mongoose.set("strictQuery", true);

	// Since we're using Next API serverless functions, check mongoose connection state
	// 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
	if (mongoose.connection.readyState === 1) {
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
				mongoose.connection.off("error", onError);
				mongoose.connection.off("disconnected", onDisconnected);
				resolve();
			};

			const onError = (err: Error) => {
				clearTimeout(timeout);
				console.error(`[${timestamp}] Connection error:`, err);
				mongoose.connection.off("connected", onConnected);
				mongoose.connection.off("disconnected", onDisconnected);
				reject(err);
			};

			const onDisconnected = () => {
				clearTimeout(timeout);
				console.error(`[${timestamp}] Disconnected during connection attempt`);
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
