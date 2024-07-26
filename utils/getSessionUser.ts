import { auth } from "@clerk/nextjs/server";

export const getSessionUser = async () => {
	const { userId } = auth();

	if (!userId) {
		return null;
	}

	return {
		user: { id: userId },
		userId,
	};
};
