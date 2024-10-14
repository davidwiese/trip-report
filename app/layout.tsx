import { CSPostHogProvider } from "@/app/_analytics/provider";
import "@/assets/styles/globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { GlobalProvider } from "@/context/GlobalContext";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "photoswipe/dist/photoswipe.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
	title: {
		default: "Trip Report",
		template: "%s | Trip Report",
	},
	alternates: {
		canonical: "https://www.tripreport.co",
	},
	description:
		"Create trip reports, find beta, or blog your entire thru-hike. Share your outdoor adventures with a community of hikers, climbers, and explorers.",
	keywords: [
		"trip report",
		"trip reports",
		"hiking",
		"hikes",
		"backpacking",
		"climbing",
		"mountaineering",
		"alpinism",
		"skimo",
		"skiing",
		"ski mountaineering",
		"beta",
		"info",
		"information",
		"thru-hike",
		"thru-hiking",
		"blog",
		"thruhiking",
		"thruhike",
		"thru hike",
		"thru hiking",
	],
	openGraph: {
		title: "Trip Report",
		description:
			"Share your trips, find beta, and connect with other adventurers.",
		type: "website",
		locale: "en_US",
		url: "https://www.tripreport.co/",
		siteName: "Trip Report",
		images: [
			{
				url: "https://www.tripreport.co/og.png",
				width: 1200,
				height: 630,
				alt: "Trip Report - Share Your Outdoor Adventures",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Trip Report",
		description:
			"Share your trips, find beta, and connect with other adventurers.",
		images: [
			{
				url: "https://www.tripreport.co/og.png",
				alt: "Trip Report - Share Your Outdoor Adventures",
			},
		],
	},
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{
				url: "/favicon/android-chrome-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				url: "/favicon/android-chrome-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
		apple: [
			{
				url: "/favicon/apple-touch-icon.png",
				sizes: "180x180",
				type: "image/png",
			},
		],
		other: [{ rel: "manifest", url: "/favicon/site.webmanifest" }],
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const isDevelopment = process.env.NODE_ENV === "development";

	const publishableKey = isDevelopment
		? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_DEV
		: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

	if (!publishableKey) {
		throw new Error("Missing Clerk Publishable Key");
	}

	// Only use these configs in development
	const clerkConfig = isDevelopment
		? {
				signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
				signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
				forceRedirectUrl:
					process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
		  }
		: {};

	return (
		<ClerkProvider
			publishableKey={publishableKey}
			afterSignOutUrl={"/"}
			{...clerkConfig}
		>
			<CSPostHogProvider>
				<GlobalProvider>
					<html
						lang="en"
						className={GeistSans.className}
						suppressHydrationWarning
					>
						<body>
							<ThemeProvider
								attribute="class"
								defaultTheme="system"
								enableSystem
							>
								<Navbar />
								<main className="-mb-[6px]">{children}</main>
								<Footer />
								<ToastContainer />
							</ThemeProvider>
						</body>
					</html>
				</GlobalProvider>
			</CSPostHogProvider>
		</ClerkProvider>
	);
}
