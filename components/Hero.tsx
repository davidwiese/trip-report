import ReportSearchForm from "@/components/ReportSearchForm";
import Image from "next/image";
import Link from "next/link";
import heroImage from "@/assets/images/hero.jpg";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
import { FaChartLine, FaComments, FaMap, FaPenFancy } from "react-icons/fa";
import { montserrat } from "@/app/fonts";
import HeroCard from "@/components/HeroCard";

type HeroProps = {
	// Add any props here if needed
};
const Hero: React.FC<HeroProps> = () => {
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
				<div className={`mb-16 ${montserrat.className}`}>
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
				{/* Cards */}
				<div className="mt-12 mx-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					<HeroCard
						icon={<FaPenFancy />}
						title="Easy Report Creation"
						description="Create detailed reports with descriptions, images, and more."
					/>
					<HeroCard
						icon={<FaChartLine />}
						title="Tracked User Statistics"
						description="View miles hiked, total elevation gain/loss, and more."
					/>
					<HeroCard
						icon={<FaComments />}
						title="Community Insights"
						description="Find new partners and gain valuable trip beta from our community."
					/>
					<HeroCard
						icon={<FaMap />}
						title="Caltopo Map Integration"
						description="Embed Caltopo maps directly into your trip reports."
					/>
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
