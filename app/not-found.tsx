"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";
import { ThemeProvider } from "next-themes";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const NotFoundContent: React.FC = () => {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null; // or return a skeleton/loading state
	}

	return (
		<section
			className={`min-h-screen flex-grow ${
				resolvedTheme === "dark" ? "bg-black text-white" : "bg-white text-black"
			}`}
		>
			<div className="container m-auto max-w-2xl py-24">
				<div
					className={`px-6 py-24 mb-4 shadow-md rounded-md border m-4 md:m-0 ${
						resolvedTheme === "dark"
							? "bg-black text-white"
							: "bg-white text-black"
					}`}
				>
					<div className="flex justify-center">
						<FaExclamationTriangle className="text-8xl text-yellow-400" />
					</div>
					<div className="text-center">
						<h1 className="text-3xl font-bold mt-4 mb-2">Page Not Found</h1>
						<p className="text-gray-500 text-xl mb-10">
							The page you are looking for does not exist.
						</p>
						<Button
							asChild
							variant="secondary"
							className={`w-1/3 ${
								resolvedTheme === "dark"
									? "bg-white text-black hover:bg-gray-200"
									: "bg-black text-white hover:bg-gray-800"
							} border border-current`}
						>
							<Link href="/">Go Home</Link>
						</Button>
					</div>
				</div>
			</div>
			<div className="flex-grow"></div>
		</section>
	);
};

const NotFoundPage: React.FC = () => {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<NotFoundContent />
		</ThemeProvider>
	);
};

export default NotFoundPage;
