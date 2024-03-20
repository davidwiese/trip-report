import { NextRequest } from "next/server";
import connectDB from "@/config/database";

// GET /api/properties
export const GET = async (request: NextRequest) => {
	try {
		await connectDB();

		return new Response(JSON.stringify({ message: "Hello World" }), {
			status: 200,
		});
	} catch (error) {
		return new Response("Something went wrong", { status: 500 });
	}
};
