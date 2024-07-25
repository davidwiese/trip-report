import { getHomeStatistics } from "@/app/actions/getHomeStatistics";
import Hero from "@/components/Hero";
import HomeReports from "@/components/HomeReports";
import HomeStatistics from "@/components/HomeStatistics";
import CallToAction from "@/components/CallToAction";

type HomePageProps = {
	totalReports: number;
	totalDistance: number;
	totalElevationGain: number;
	totalUsers: number;
};

const HomePage: React.FC<HomePageProps> = async () => {
	const statistics = await getHomeStatistics();

	return (
		<>
			<Hero />
			<HomeReports />
			<HomeStatistics
				totalReports={statistics.totalReports}
				totalDistance={statistics.totalDistance}
				totalElevationGain={statistics.totalElevationGain}
				totalUsers={statistics.totalUsers}
			/>
			<CallToAction />
		</>
	);
};

export default HomePage;
