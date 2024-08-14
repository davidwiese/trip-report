import { standardRateLimit } from "@/utils/ratelimit";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const ip = request.ip ?? "127.0.0.1";
	const { success } = await standardRateLimit.limit(ip);

	if (!success) {
		return NextResponse.json(
			{ error: "Too many requests. Please try again later." },
			{ status: 429 }
		);
	}

	const { searchParams } = new URL(request.url);
	const url = searchParams.get("url");
	const filename = searchParams.get("filename");

	if (!url || !filename) {
		return NextResponse.json(
			{ error: "Missing URL or filename" },
			{ status: 400 }
		);
	}

	try {
		// Fetch the file from Cloudinary
		const response = await axios.get(url, {
			responseType: "stream",
		});

		// Set the headers to force download
		const headers = new Headers();
		headers.append("Content-Disposition", `attachment; filename="${filename}"`);
		headers.append("Content-Type", response.headers["content-type"]);

		return new Response(response.data, {
			headers,
		});
	} catch (error) {
		console.error("Error fetching file:", error);
		return NextResponse.json(
			{ error: "Failed to fetch file" },
			{ status: 500 }
		);
	}
}
