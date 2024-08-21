import { Metadata } from "next";

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

export default function ContactLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
