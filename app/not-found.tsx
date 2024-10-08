"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";
import { ThemeProvider } from "next-themes";

const NotFoundPage: React.FC = () => {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<section className="min-h-screen flex-grow dark:bg-black dark:text-white">
				<div className="container m-auto max-w-2xl py-24">
					<div className="bg-white dark:bg-black dark:text-white px-6 py-24 mb-4 shadow-md rounded-md border m-4 md:m-0">
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
								className="bg-black hover:bg-gray-800 text-white w-1/3 dark:border dark:border-white"
							>
								<Link href="/">Go Home</Link>
							</Button>
						</div>
					</div>
				</div>
				<div className="flex-grow"></div>
			</section>
		</ThemeProvider>
	);
};

export default NotFoundPage;
