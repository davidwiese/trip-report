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
	try {
		if (process.env.MONGODB_URI) {
			await mongoose.connect(process.env.MONGODB_URI);
			connected = true;
			console.log("MongoDB connected...");
		} else {
			console.log("MongoDB URL is undefined");
		}
	} catch (error) {
		console.log(error);
	}
};

export default connectDB;
