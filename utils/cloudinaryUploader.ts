import axios from "axios";
import imageCompression from "browser-image-compression";

async function compressImage(file: File): Promise<File> {
	// Skip compression for HEIC/HEIF files
	if (file.type.includes("heic") || file.type.includes("heif")) {
		return file;
	}
	// Otherwise, compress the image
	const options = {
		maxSizeMB: 2,
		maxWidthOrHeight: 2048,
		useWebWorker: true,
	};

	try {
		return await imageCompression(file, options);
	} catch (error) {
		console.error("Error compressing image:", error);
		return file; // Return original file if compression fails
	}
}

export async function uploadImage(
	file: File
): Promise<{ url: string; originalFilename: string }> {
	const compressedFile = await compressImage(file);
	const formData = new FormData();
	formData.append("file", compressedFile);

	try {
		const response = await axios.post("/api/upload", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		const { url, originalFilename } = response.data;

		return { url, originalFilename: file.name };
	} catch (error: unknown) {
		console.error("Error uploading image to Cloudinary:", error);
		if (axios.isAxiosError(error)) {
			throw new Error(
				`Error uploading image: ${
					error.response?.data?.error?.message || error.message
				}`
			);
		} else if (error instanceof Error) {
			throw new Error(`Error uploading image: ${error.message}`);
		} else {
			throw new Error("An unknown error occurred while uploading the image.");
		}
	}
}
