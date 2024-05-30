import Link from "next/link";
import { Button } from "@/components/ui/button";

type CallToActionProps = {
	// Add any props here if needed
};

const CallToAction: React.FC<CallToActionProps> = () => {
	return (
		<section className="py-12 bg-gray-100">
			<div className="container mx-auto px-4 text-center">
				<h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
				<p className="text-gray-600 mb-8">
					Become a part of our growing community of outdoor enthusiasts. Share
					your adventures and discover new ones.
				</p>
				<Button asChild className="px-6 py-3 rounded-lg">
					<Link href="/auth/signin">Get Started</Link>
				</Button>
			</div>
		</section>
	);
};
export default CallToAction;
