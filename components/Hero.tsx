import ReportSearchForm from "@/components/ReportSearchForm";
import Image from "next/image";
import Link from "next/link";
import heroImage from "@/assets/images/hero.jpg";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";

type HeroProps = {
	// Add any props here if needed
};
const Hero = () => {
	return (
		<section className="relative bg-gray-900 text-white">
			<div className="absolute inset-0">
				<Image
					src={heroImage}
					alt="Outdoor adventure"
					layout="fill"
					objectFit="cover"
					className="opacity-25 absolute inset-0 z-0"
					quality={100}
				/>
				<div className="absolute inset-0 bg-black opacity-50"></div>
			</div>
			<BackgroundBeams />
			<div className="relative container mx-auto px-4 py-24 text-center">
				<h1 className="text-4xl font-bold mb-4">
					Discover and Share Your Outdoor Adventures
				</h1>
				<p className="text-lg mb-8">
					Create detailed trip reports, find trail information, and share your
					outdoor experiences with our community.
				</p>
				<div className="flex justify-center space-x-4">
					<Button asChild>
						<Link href="/reports/add">Create a Report</Link>
					</Button>
					<Button asChild>
						<Link href="/reports">View Reports</Link>
					</Button>
				</div>
				<ReportSearchForm />
				<div className="mt-12 mx-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					<div className="flex items-center space-x-4">
						<div className="text-primary-500">
							{/* Replace with an appropriate icon */}
							<svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
								<path d="M10 12h4v6H6v-6h4zm1-10h2v3h-2V2zm-4 0h2v3H7V2zm-4 0h2v3H3V2zm8 0h2v3h-2V2zm-4 0h2v3H7V2zm-4 0h2v3H3V2z" />
							</svg>
						</div>
						<div>
							<h3 className="font-bold">Easy Report Creation</h3>
							<p>
								Create detailed reports with descriptions, images, and more.
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-4">
						<div className="text-primary-500">
							{/* Replace with an appropriate icon */}
							<svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
								<path d="M10 12h4v6H6v-6h4zm1-10h2v3h-2V2zm-4 0h2v3H7V2zm-4 0h2v3H3V2zm8 0h2v3h-2V2zm-4 0h2v3H7V2zm-4 0h2v3H3V2z" />
							</svg>
						</div>
						<div>
							<h3 className="font-bold">GPX/KML File Support</h3>
							<p>
								Upload and share your GPX/KML files for detailed trip tracking.
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-4">
						<div className="text-primary-500">
							{/* Replace with an appropriate icon */}
							<svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
								<path d="M10 12h4v6H6v-6h4zm1-10h2v3h-2V2zm-4 0h2v3H7V2zm-4 0h2v3H3V2zm8 0h2v3h-2V2zm-4 0h2v3H7V2zm-4 0h2v3H3V2z" />
							</svg>
						</div>
						<div>
							<h3 className="font-bold">Caltopo Map Integration</h3>
							<p>Embed Caltopo maps directly into your trip reports.</p>
						</div>
					</div>
					<div className="flex items-center space-x-4">
						<div className="text-primary-500">
							{/* Replace with an appropriate icon */}
							<svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
								<path d="M10 12h4v6H6v-6h4zm1-10h2v3h-2V2zm-4 0h2v3H7V2zm-4 0h2v3H3V2zm8 0h2v3h-2V2zm-4 0h2v3H7V2zm-4 0h2v3H3V2z" />
							</svg>
						</div>
						<div>
							<h3 className="font-bold">Community Insights</h3>
							<p>Read reports from other users and gain valuable insights.</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
