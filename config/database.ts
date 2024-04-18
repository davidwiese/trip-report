import mongoose from "mongoose";

let connected = false;

const connectDB = async () => {
	// Only fields specified in our schema will be saved to the db
	mongoose.set("strictQuery", true);

	// Since we're using Next API serverless functions, if the db is already connected, don't connect again
	if (connected) {
		console.log("MongoDB is already connected...");
		return;
	}

	// Connect to MongoDB
	await mongoose.connect(process.env.MONGODB_URI as string);
	connected = true;
	console.log("MongoDB connected...");
};

export default connectDB;
