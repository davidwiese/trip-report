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
		<main className="bg-white p-8">
			<TermsOfService />
		</main>
	);
};

export default TermsPage;
