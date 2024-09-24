import TermsOfService from "@/components/TermsOfService";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Terms of Service",
	description:
		"Read our Terms of Service to understand the rules and regulations governing the use of Trip Report.",
	openGraph: {
		title: "Trip Report Terms of Service",
		description: "Our terms and conditions for using the Trip Report platform.",
		type: "website",
	},
};

const TermsPage: React.FC = () => {
	return (
		<main className="container mx-auto p-12 dark:bg-black dark:bg-gradient-to-b dark:from-[#191919] dark:via-black dark:to-[#191919]">
			<TermsOfService />
		</main>
	);
};

export default TermsPage;
