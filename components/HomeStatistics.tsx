import { montserrat } from "@/app/fonts";

type HomeStatisticsProps = {
	// Add any props here if needed
};

const HomeStatistics: React.FC<HomeStatisticsProps> = () => {
	return (
		<div className="h-auto min-h-[30rem] w-full dark:bg-black bg-white dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative flex items-center justify-center">
			<section className="py-12 relative z-10">
				<div className="container mx-auto px-4 text-center">
					<h2 className={`text-3xl font-bold mb-8 ${montserrat.className}`}>
						Community Stats
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
						<div>
							<h3 className="text-4xl font-bold text-primary-600">1,234</h3>
							<p className="text-gray-600">Reports Created</p>
						</div>
						<div>
							<h3 className="text-4xl font-bold text-primary-600">5,678</h3>
							<p className="text-gray-600">Miles Hiked</p>
						</div>
						<div>
							<h3 className="text-4xl font-bold text-primary-600">910</h3>
							<p className="text-gray-600">Climbs Conquered</p>
						</div>
						<div>
							<h3 className="text-4xl font-bold text-primary-600">2,345</h3>
							<p className="text-gray-600">Users Joined</p>
						</div>
					</div>
				</div>
			</section>
			<div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] sm:[mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)] md:[mask-image:radial-gradient(ellipse_at_center,transparent_40%,black)] lg:[mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)]"></div>
		</div>
	);
};

export default HomeStatistics;
