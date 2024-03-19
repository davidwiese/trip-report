import Hero from "@/components/Hero";
import InfoBoxes from "@/components/InfoBoxes";

type HomePageProps = {
	// Add any props here if needed
};

const HomePage: React.FC<HomePageProps> = () => {
	return (
		<>
			<Hero />
			<InfoBoxes />
		</>
	);
};
export default HomePage;
