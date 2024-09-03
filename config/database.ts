import mongoose from "mongoose";
import User from "@/models/User";
import Report from "@/models/Report";
import Message from "@/models/Message";

interface MongooseCache {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
}

// Add a type declaration for the `mongoose` property on the global object
declare global {
	var mongoose: MongooseCache | undefined;
}

const options = {
	bufferCommands: false,
	socketTimeoutMS: 45000,
	serverSelectionTimeoutMS: 5000,
};

const mongoURI =
	process.env.NODE_ENV === "production"
		? process.env.MONGODB_URI
		: process.env.MONGODB_URI_DEV || process.env.MONGODB_URI;

if (!mongoURI) {
	throw new Error("MongoDB connection URI is not defined.");
}

// Global is used here to maintain a cached connection across hot reloads in development and between lambda invocations
let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		cached.promise = mongoose.connect(mongoURI, options).then((mongoose) => {
			console.log("MongoDB connected successfully.");
			return mongoose;
		});
	}

	try {
		cached.conn = await cached.promise;

		// Ensure models are registered only if they haven't been already
		if (!mongoose.models.User) {
			mongoose.model("User", User.schema);
		}
		if (!mongoose.models.Report) {
			mongoose.model("Report", Report.schema);
		}
		if (!mongoose.models.Message) {
			mongoose.model("Message", Message.schema);
		}
	} catch (error) {
		cached.promise = null;
		throw error;
	}

	return cached.conn;
};

export default connectDB;
