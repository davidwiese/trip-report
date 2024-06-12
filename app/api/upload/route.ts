import { NextResponse } from "next/server";
import cloudinary from "cloudinary";

cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
	try {
		const data = await request.formData();
		const file = data.get("file") as File;
		const folder = data.get("folder") as string;

		// Convert file to base64
		const arrayBuffer = await file.arrayBuffer();
		const base64File = Buffer.from(arrayBuffer).toString("base64");

		const result = await cloudinary.v2.uploader.upload(
			`data:${file.type};base64,${base64File}`,
			{
				folder,
				resource_type: "auto",
			}
		);

		return NextResponse.json({
			url: result.secure_url,
			originalFilename: result.original_filename,
		});
	} catch (error) {
		console.error("Error uploading image to Cloudinary:", error);
		return NextResponse.json(
			{ error: "Error uploading image" },
			{ status: 500 }
		);
	}
}
