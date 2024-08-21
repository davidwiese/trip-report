"use client";

import ContactForm from "@/components/ContactForm";
import { Metadata } from "next";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const metadata: Metadata = {
	title: "Contact Us",
	description:
		"Get in touch with the Trip Report team. We're here to help with any questions or feedback you may have.",
	openGraph: {
		title: "Contact Trip Report",
		description: "Reach out to us with your questions or feedback.",
		type: "website",
	},
};

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
		<div className="container max-w-3xl px-4 py-8">
			<h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
			<ContactForm initialErrorMessage={errorMessage} />
		</div>
	);
}
