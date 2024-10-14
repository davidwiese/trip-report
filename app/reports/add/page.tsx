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
};

const ReportAddPage: React.FC<ReportAddPageProps> = () => {
	return (
		<section className="bg-white dark:bg-black dark:bg-gradient-to-b dark:from-[#191919] dark:via-black dark:to-[#191919]">
			<div className="w-full px-4 m-auto max-w-2xl py-12">
				<div className="bg-white px-4 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
					<ReportAddForm />
				</div>
			</div>
		</section>
	);
};
export default ReportAddPage;
