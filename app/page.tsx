import Hero from "@/components/Hero";
import HomeReports from "@/components/HomeReports";
import HomeStatistics from "@/components/HomeStatistics";
import CallToAction from "@/components/CallToAction";

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
