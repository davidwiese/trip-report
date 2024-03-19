import Link from "next/link";

type ReportsPageProps = {
	// Add any props here if needed
};

const ReportsPage: React.FC<ReportsPageProps> = () => {
	return (
		<div>
			<h1 className="text-3xl">Reports</h1>
			<Link href="/">Go Home</Link>
		</div>
	);
};
export default ReportsPage;
