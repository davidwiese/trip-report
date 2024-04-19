import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

interface SessionUser {
	id: string;
}

export const getSessionUser = async () => {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			throw new Error("No session or user found");
		}

		const expiresAt = new Date(session.expires);
		const currentTime = new Date();

		if (expiresAt < currentTime) {
			throw new Error("Session has expired");
		}

		const user = session.user as SessionUser;

		return {
			user,
			userId: user.id,
		};
	} catch (error) {
		console.error("Error in getSessionUser:", error);
		throw error;
	}
};
