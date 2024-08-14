"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import { standardRateLimit } from "@/utils/ratelimit";
import { findUserByClerkId } from "@/utils/userUtils";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

async function updateBio(bio: string) {
	await connectDB();

	const { userId: clerkUserId } = auth();

	if (!clerkUserId) {
		return { error: "User not authenticated" };
	}

	const { success } = await standardRateLimit.limit(clerkUserId);

	if (!success) {
		return { error: "Too many requests. Please try again later." };
	}

	try {
		const user = await findUserByClerkId(clerkUserId);
		if (!user) {
			return { error: "User not found" };
		}

		const updateUser = await User.findByIdAndUpdate(
			user._id,
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
