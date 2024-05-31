import ReportSearchForm from "@/components/ReportSearchForm";
import Image from "next/image";
import Link from "next/link";
import heroImage from "@/assets/images/hero.jpg";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
import { FaChartLine, FaComments, FaMap, FaPenFancy } from "react-icons/fa";

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
					fill
					style={{ objectFit: "cover" }}
					className="opacity-25 absolute inset-0 z-0"
					quality={100}
				/>
				<div className="absolute inset-0 bg-black opacity-50"></div>
			</div>
			<BackgroundBeams />
			<div className="relative container mx-auto px-4 py-24 text-center">
				<div className="mb-16">
					<h1 className="text-6xl font-bold mb-4">Trip Report</h1>
					<p className="text-lg">
						Share your trips, find beta, and connect with other adventurers.
					</p>
				</div>
				<div className="flex justify-center space-x-4 mb-16">
					<Button asChild className="glow-on-hover">
						<Link className="w-[125px]" href="/reports/add">
							Create Report
						</Link>
					</Button>
					<Button asChild className="glow-on-hover">
						<Link className="w-[125px]" href="/reports">
							View Reports
						</Link>
					</Button>
				</div>
				<div className="mb-16">
					<ReportSearchForm />
				</div>
				<div className="mt-12 mx-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					<div className="bg-white dark:bg-zinc-800 text-black dark:text-white p-6 rounded-lg shadow-md flex flex-col items-center">
						<FaPenFancy className="text-4xl text-primary-500 mb-4" />
						<h3 className="font-bold text-xl mb-2">Easy Report Creation</h3>
						<p className="text-center">
							Create detailed reports with descriptions, images, and more.
						</p>
					</div>
					<div className="bg-white dark:bg-zinc-800 text-black dark:text-white p-6 rounded-lg shadow-md flex flex-col items-center">
						<FaChartLine className="text-4xl text-primary-500 mb-4" />
						<h3 className="font-bold text-xl mb-2">Tracked User Statistics</h3>
						<p className="text-center">
							View miles hiked, total elevation gain/loss, and more.
						</p>
					</div>
					<div className="bg-white dark:bg-zinc-800 text-black dark:text-white p-6 rounded-lg shadow-md flex flex-col items-center">
						<FaMap className="text-4xl text-primary-500 mb-4" />
						<h3 className="font-bold text-xl mb-2">Caltopo Map Integration</h3>
						<p className="text-center">
							Embed Caltopo maps directly into your trip reports.
						</p>
					</div>
					<div className="bg-white dark:bg-zinc-800 text-black dark:text-white p-6 rounded-lg shadow-md flex flex-col items-center">
						<FaComments className="text-4xl text-primary-500 mb-4" />
						<h3 className="font-bold text-xl mb-2">Community Insights</h3>
						<p className="text-center">
							Gain valuable beta and insights from our community.
						</p>
					</div>
				</div>
			</div>
			<div className="w-full absolute left-1/2 transform -translate-x-1/2">
				<div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-indigo-900 to-transparent h-[5px] w-full blur-sm"></div>
				<div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-indigo-800 to-transparent h-px w-full"></div>
				<div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-sky-800 to-transparent h-[5px] w-full blur-sm"></div>
				<div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-sky-700 to-transparent h-px w-full"></div>
			</div>
		</section>
	);
};

export default Hero;
