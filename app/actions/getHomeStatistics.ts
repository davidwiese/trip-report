import connectDB from "@/config/database";
import User from "@/models/User";
import Report from "@/models/Report";

export const getHomeStatistics = async () => {
	await connectDB();

	const totalUsers = await User.countDocuments();
	const totalReports = await Report.countDocuments();

	const users = await User.find();

	const totalDistance = users.reduce(
		(acc, user) => acc + user.totalDistance,
		0
	);
	const totalElevationGain = users.reduce(
		(acc, user) => acc + user.totalElevationGain,
		0
	);

	return {
		totalUsers,
		totalReports,
		totalDistance,
		totalElevationGain,
	};
};
