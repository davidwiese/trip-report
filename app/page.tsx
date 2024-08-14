import CallToAction from "@/components/CallToAction";
import Hero from "@/components/Hero";
import HomeReports from "@/components/HomeReports";
import HomeStatistics from "@/components/HomeStatistics";

const HomePage: React.FC = async () => {
	return (
		<>
			<Hero />
			<HomeReports />
			<HomeStatistics />
			<CallToAction />
		</>
	);
};

export default HomePage;
