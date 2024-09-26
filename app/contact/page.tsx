"use client";

import ContactForm from "@/components/ContactForm";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ContactPage() {
	const searchParams = useSearchParams();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	useEffect(() => {
		const error = searchParams.get("error");
		if (error) {
			setErrorMessage(decodeURIComponent(error));
		}
	}, [searchParams]);

	return (
		<section className="bg-white min-h-screen flex flex-col dark:bg-black dark:bg-gradient-to-b dark:from-[#191919] dark:via-black dark:to-[#191919]">
			<div className="container max-w-3xl px-4 py-8">
				<h1 className="text-3xl font-bold mb-6 text-center dark:text-white">
					Contact Us
				</h1>
				<ContactForm initialErrorMessage={errorMessage} />
			</div>
		</section>
	);
}
