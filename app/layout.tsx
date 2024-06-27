import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import { ToastContainer } from "react-toastify";
import { GlobalProvider } from "@/context/GlobalContext";
import { GeistSans } from "geist/font/sans";
import "@/assets/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "photoswipe/dist/photoswipe.css";

interface MainLayoutProps {
	children: React.ReactNode;
}

export const metadata = {
	title: "Trip Report",
	description: "Create trip reports, find beta, or blog your entire thru-hike",
	keywords:
		"trip report, trip reports, hiking, hikes, backpacking, climbing, mountaineering, alpinism, skimo, skiing, ski mountaineering, beta, info, information, thru-hike, thru-hiking, blog, thruhiking, thruhike, thru hike, thru hiking",
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	return (
		<AuthProvider>
			<GlobalProvider>
				<html lang="en" className={GeistSans.className}>
					<body>
						<Navbar />
						<main>{children}</main>
						<Footer />
						<ToastContainer />
					</body>
				</html>
			</GlobalProvider>
		</AuthProvider>
	);
};
export default MainLayout;
