import Image from "next/image";
import logo from "@/assets/images/logo_fill.png";

type FooterProps = {
	// Add any props here if needed
};

const Footer: React.FC<FooterProps> = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gray-200 py-4">
			<div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-2 sm:px-6 lg:px-8">
				<div className="mb-4 md:mb-0">
					<Image src={logo} alt="Logo" className="h-8 w-auto ml-0.5" />
				</div>
				<div>
					<p className="text-sm text-gray-500 mt-2 md:mt-0">
						&copy; {currentYear} Trip Report. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};
export default Footer;
