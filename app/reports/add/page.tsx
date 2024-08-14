import ReportAddForm from "@/components/ReportAddForm";

type ReportAddPageProps = {
	// Add any props here if needed
};

const ReportAddPage: React.FC<ReportAddPageProps> = () => {
	return (
		<section className="bg-white">
			<div className="container m-auto max-w-2xl py-24">
				<div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
					<ReportAddForm />
				</div>
			</div>
		</section>
	);
};
export default ReportAddPage;
