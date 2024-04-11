import Reports from "@/components/Reports";
import ReportSearchForm from "@/components/ReportSearchForm";

type ReportsPageProps = {
	// Add any props here if needed
};

const ReportsPage: React.FC<ReportsPageProps> = async () => {
	return (
		<>
			<section className="bg-blue-700 py-4">
				<div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
					<ReportSearchForm />
				</div>
			</section>
			<Reports />
		</>
	);
};
export default ReportsPage;
