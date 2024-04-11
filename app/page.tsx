import Hero from "@/components/Hero";
import InfoBoxes from "@/components/InfoBoxes";
import HomeReports from "@/components/HomeReports";
import FeaturedReports from "@/components/FeaturedReports";

type HomePageProps = {
	// Add any props here if needed
};

const HomePage: React.FC<HomePageProps> = () => {
	return (
		<>
			<Hero />
			<InfoBoxes />
			<FeaturedReports />
			<HomeReports />
		</>
	);
};
export default HomePage;
