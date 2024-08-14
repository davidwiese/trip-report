"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { FaCopy, FaExclamationTriangle } from "react-icons/fa";

interface ErrorPageProps {
	error: Error;
	reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
	const [copied, setCopied] = useState(false);

	const copyError = () => {
		navigator.clipboard.writeText(error.message);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<section className="min-h-screen flex-grow">
			<div className="container m-auto max-w-2xl py-24">
				<div className="bg-white px-6 py-24 mb-4 shadow-md rounded-md border m-4 md:m-0">
					<div className="flex justify-center">
						<FaExclamationTriangle className="text-8xl text-red-500" />
					</div>
					<div className="text-center">
						<h1 className="text-3xl font-bold mt-4 mb-2">
							Something went wrong!
						</h1>
						<div className="bg-gray-100 p-4 rounded-lg my-4">
							<h2 className="text-xl font-bold text-red-500 break-all">
								{error.message}
							</h2>
							<Button
								onClick={copyError}
								variant="ghost"
								className="mt-2 text-gray-600 hover:text-gray-800 flex items-center justify-center mx-auto"
							>
								<FaCopy className="mr-2" />
								{copied ? "Copied!" : "Copy error message"}
							</Button>
						</div>
						<p className="text-gray-500 text-xl mb-5">
							Please try again or report this error to us.
						</p>
						<div className="space-y-4">
							<Button
								onClick={() => reset()}
								variant="default"
								className="w-full bg-yellow-500 hover:bg-yellow-600"
							>
								Try again
							</Button>
							<Button asChild variant="destructive" className="w-full">
								<Link
									href={`/contact?error=${encodeURIComponent(error.message)}`}
								>
									Report this error
								</Link>
							</Button>
							<Button
								asChild
								variant="secondary"
								className="bg-black hover:bg-gray-800 text-white w-full"
							>
								<Link href="/">Go Home</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ErrorPage;
