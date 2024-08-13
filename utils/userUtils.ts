import User from "@/models/User";
import { User as UserType } from "@/types";

export async function findUserByClerkId(
	clerkId: string
): Promise<UserType | null> {
	try {
		const user = await User.findOne({ clerkId }).lean();
		return user as UserType | null;
	} catch (error) {
		console.error("Error finding user by Clerk ID:", error);
		return null;
	}
}
