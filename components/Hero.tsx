import ReportSearchForm from "@/components/ReportSearchForm";

type HeroProps = {
	// Add any props here if needed
};

const Hero: React.FC<HeroProps> = () => {
	return (
		<section className="bg-black py-20 mb-4">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
				<div className="text-center">
					<h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
						Find Your Next Adventure
					</h1>
					<p className="my-4 text-xl text-white">
						Discover the perfect objective for your next trip.
					</p>
				</div>
				<ReportSearchForm />
			</div>
		</section>
	);
};
export default Hero;
