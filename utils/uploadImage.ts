import cloudinary from "@/config/cloudinary";
import { v4 as uuidv4 } from "uuid";

export async function uploadImageToCloudinary(image: File): Promise<string> {
	const fileBuffer = await image.arrayBuffer();
	const base64 = Buffer.from(fileBuffer).toString("base64");
	const fileMime = image.type;
	const base64File = `data:${fileMime};base64,${base64}`;

	const result = await cloudinary.uploader.upload(base64File, {
		folder: "trip-report",
		resource_type: "image",
		public_id: `${uuidv4()}`,
	});

	return result.secure_url;
}
