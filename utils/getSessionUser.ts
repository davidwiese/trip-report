import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

export const getSessionUser = async () => {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			throw new Error("No session or user found");
		}

		return {
			user: session.user,
			userId: (session.user as { id: string }).id,
		};
	} catch (error) {
		console.error("Error in getSessionUser:", error);
		return null;
	}
};
