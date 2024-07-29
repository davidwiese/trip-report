"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { standardRateLimit } from "@/utils/ratelimit";

async function updateBio(bio: string) {
	await connectDB();

	const { userId } = auth();

	if (!userId) {
		return { error: "User not authenticated" };
	}

	const { success } = await standardRateLimit.limit(userId);

	if (!success) {
		return { error: "Too many requests. Please try again later." };
	}

	try {
		const updateUser = await User.findByIdAndUpdate(
			userId,
			{ bio },
			{ new: true, runValidators: true }
		);

		if (!updateUser) {
			return { error: "User not found" };
		}

		// Revalidate the cache
		revalidatePath("/profile", "layout");

		return { bio: updateUser.bio };
	} catch (error) {
		console.error("Error updating bio:", error);
		return {
			error: "An error occurred while updating the bio. Please try again.",
		};
	}
}

export default updateBio;
