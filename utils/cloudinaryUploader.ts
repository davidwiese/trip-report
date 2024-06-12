import axios from "axios";

export async function uploadImage(
	file: File
): Promise<{ url: string; originalFilename: string }> {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("folder", "trip-report");

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
