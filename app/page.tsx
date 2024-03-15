import Link from "next/link";

const HomePage = () => {
	return (
		<div>
			<h1 className="text-3xl">Welcome</h1>
			<Link href="/reports">Go To Reports</Link>
		</div>
	);
};
export default HomePage;
