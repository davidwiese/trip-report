import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import { ToastContainer } from "react-toastify";
import { GlobalProvider } from "@/context/GlobalContext";
import "@/assets/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "photoswipe/dist/photoswipe.css";

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
		<GlobalProvider>
			<AuthProvider>
				<html lang="en">
					<body>
						<Navbar />
						<main>{children}</main>
						<Footer />
						<ToastContainer />
					</body>
				</html>
			</AuthProvider>
		</GlobalProvider>
	);
};
export default MainLayout;
