import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/Spotlight";

type CallToActionProps = {
	// Add any props here if needed
};

const CallToAction: React.FC<CallToActionProps> = () => {
	return (
		<section className="relative py-20">
			<div className="absolute inset-0">
				<Spotlight
					className="-top-40 left-0 md:left-80 md:-top-20"
					fill="white"
				/>
				<div className="h-2/3 bg-gradient-to-b from-black via-black to-gray-600"></div>
				<div className="h-1/3 bg-gradient-to-b from-gray-600 to-gray-200"></div>
			</div>
			<div className="container mx-auto px-4 text-center relative z-10">
				<h2 className="text-3xl text-white font-bold mb-4">
					Join Our Community
				</h2>
				<p className="text-gray-200 mb-8">
					Become a part of our growing community of outdoor enthusiasts. Share
					your adventures and discover new ones.
				</p>
				<Button asChild className="px-6 py-3 rounded-lg border border-gray-500">
					<Link href="/auth/signin">Get Started</Link>
				</Button>
			</div>
		</section>
	);
};

export default CallToAction;
