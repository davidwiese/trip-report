import CallToAction from "@/components/CallToAction";
import Hero from "@/components/Hero";
import HomeReports from "@/components/HomeReports";
import HomeStatistics from "@/components/HomeStatistics";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Trip Report",
	alternates: {
		canonical: "https://www.tripreport.co",
	},
	description:
		"Join Trip Report to create and share your hiking, climbing, and outdoor adventure reports. Connect with a community of nature enthusiasts and explorers.",
	openGraph: {
		title: "Create and Share Your Outdoor Adventures | Trip Report",
		description:
			"Join Trip Report to create and share your hiking, climbing, and outdoor adventure reports. Connect with a community of nature enthusiasts and explorers.",
		images: [
			{
				url: "https://www.tripreport.co/images/logo_fill.png", // Replace with an image specific to your homepage
				alt: "Trip Report Homepage",
			},
		],
	},
};

const HomePage: React.FC = async () => {
	return (
		<div className="bg-white dark:bg-black">
			<Hero />
			<HomeReports />
			<HomeStatistics />
			<CallToAction />
		</div>
	);
};

export default HomePage;
