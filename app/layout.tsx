import { CSPostHogProvider } from "@/app/_analytics/provider";
import "@/assets/styles/globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { GlobalProvider } from "@/context/GlobalContext";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import "photoswipe/dist/photoswipe.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
	const publishableKey =
		process.env.NODE_ENV === "production"
			? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
			: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_DEV ||
			  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

	return (
		<ClerkProvider publishableKey={publishableKey} afterSignOutUrl={"/"}>
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
