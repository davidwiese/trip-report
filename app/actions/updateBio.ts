"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { standardRateLimit } from "@/utils/ratelimit";

async function updateBio(bio: string) {
	await connectDB();

	const sessionUser = await getSessionUser();

	if (!sessionUser || !sessionUser.userId) {
		return { error: "User not authenticated" };
	}

	const { success } = await standardRateLimit.limit(sessionUser.userId);

	if (!success) {
		return { error: "Too many requests. Please try again later." };
	}

	const { userId } = sessionUser;

	try {
		const updateUser = await User.findByIdAndUpdate(
			userId,
			{ bio },
			{ new: true, runValidators: true }
		);

		if (!updateUser) {
			return { error: "User not found" };
		}

		return { bio: updateUser.bio };

		// Revalidate the cache
		revalidatePath("/profile", "layout");
	} catch (error) {
		console.error("Error updating bio:", error);
		return {
			error: "An error occurred while updating the bio. Please try again.",
		};
	}
}

export default updateBio;
