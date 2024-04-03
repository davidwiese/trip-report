import Hero from "@/components/Hero";
import InfoBoxes from "@/components/InfoBoxes";
import HomeReports from "@/components/HomeReports";
import Footer from "@/components/Footer";

type HomePageProps = {
	// Add any props here if needed
};

const HomePage: React.FC<HomePageProps> = () => {
	return (
		<>
			<Hero />
			<InfoBoxes />
			<HomeReports />
		</>
	);
};
export default HomePage;
