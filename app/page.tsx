import Link from "next/link";

type HomePageProps = {
	// Add any props here if needed
};

const HomePage: React.FC<HomePageProps> = () => {
	return (
		<div>
			<h1 className="text-3xl">Welcome</h1>
			<Link href="/reports">Go To Reports</Link>
		</div>
	);
};
export default HomePage;
