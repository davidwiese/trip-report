import ReportAddForm from "@/components/ReportAddForm";
import { Metadata } from "next";

type ReportAddPageProps = {};

export const metadata: Metadata = {
	title: "Add Trip Report",
	alternates: {
		canonical: "https://www.tripreport.co/reports/add",
	},
	description:
		"Create and share a new trip report with the Trip Report community.",
	robots: { index: false, follow: false }, // Since this is a private page
};

const ReportAddPage: React.FC<ReportAddPageProps> = () => {
	return (
		<section className="bg-white dark:bg-black dark:bg-gradient-to-b dark:from-[#191919] dark:via-black dark:to-[#191919]">
			<div className="container m-auto max-w-2xl py-12">
				<div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
					<ReportAddForm />
				</div>
			</div>
		</section>
	);
};
export default ReportAddPage;
