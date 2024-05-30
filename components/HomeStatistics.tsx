type HomeStatisticsProps = {
	// Add any props here if needed
};

const HomeStatistics: React.FC<HomeStatisticsProps> = () => {
	return (
		<section className="py-12 bg-white">
			<div className="container mx-auto px-4 text-center">
				<h2 className="text-3xl font-bold mb-8">Community Stats</h2>
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
	);
};
export default HomeStatistics;
