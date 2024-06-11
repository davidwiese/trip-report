import Hero from "@/components/Hero";
import HomeReports from "@/components/HomeReports";
import HomeStatistics from "@/components/HomeStatistics";
import CallToAction from "@/components/CallToAction";

type HomePageProps = {
	// Add any props here if needed
};

const HomePage: React.FC<HomePageProps> = () => {
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
