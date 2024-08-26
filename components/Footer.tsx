import logo from "@/public/images/logo_fill.png";
import Image from "next/image";
import Link from "next/link";
import { BiLogoInstagramAlt } from "react-icons/bi";

type FooterProps = {};

const Footer: React.FC<FooterProps> = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gray-200 py-4 mt-0">
			<div className="container mx-auto px-2 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
					<div className="flex items-center justify-center md:justify-start">
						<Image src={logo} alt="Logo" className="h-8 w-auto ml-0.5" />
						<div className="ml-4 flex items-center">
							<Link
								href="/privacy-policy"
								className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
							>
								Privacy
							</Link>
							<span className="mx-2 text-gray-600">·</span>
							<Link
								href="/terms"
								className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
							>
								Terms
							</Link>
							<span className="mx-2 text-gray-600">·</span>
							<Link
								href="/contact"
								className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
							>
								Contact
							</Link>
						</div>
					</div>
					<div className="flex justify-center items-center">
						<a
							href="https://www.instagram.com/tripreport.co"
							target="_blank"
							rel="noopener noreferrer"
							className="flex justify-center items-center"
						>
							<BiLogoInstagramAlt className="h-10 w-auto" />
						</a>
					</div>
					<div className="flex flex-col items-center md:items-end">
						<p className="text-sm text-gray-600 mt-2 md:mt-0 text-nowrap">
							&copy; {currentYear} Trip Report™. All rights reserved.
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};
export default Footer;
