import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import "@/assets/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "photoswipe/dist/photoswipe.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CSPostHogProvider } from "@/app/_analytics/provider";
import { ToastContainer } from "react-toastify";
import { GlobalProvider } from "@/context/GlobalContext";

export const metadata = {
	title: "Trip Report",
	description: "Create trip reports, find beta, or blog your entire thru-hike",
	keywords:
		"trip report, trip reports, hiking, hikes, backpacking, climbing, mountaineering, alpinism, skimo, skiing, ski mountaineering, beta, info, information, thru-hike, thru-hiking, blog, thruhiking, thruhike, thru hike, thru hiking",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider
			publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
			afterSignOutUrl={"/"}
		>
			<CSPostHogProvider>
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
			</CSPostHogProvider>
		</ClerkProvider>
	);
}
