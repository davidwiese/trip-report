import "@/assets/styles/globals.css";

interface MainLayoutProps {
	children: React.ReactNode;
}

export const metadata = {
	title: "Trip Report",
	description: "Create trip reports, find beta, or blog your thru-hike",
	keywords:
		"trip report, trip reports, hiking, hikes, backpacking, climbing, mountaineering, alpinism, skimo, skiing, ski mountaineering, beta, info, information, thru-hike, thru-hiking, blog",
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	return (
		<html lang="en">
			<body>
				<div>{children}</div>
			</body>
		</html>
	);
};
export default MainLayout;
