import InfoBox from "@/components/InfoBox";

type InfoBoxesProps = {
	// Add any props here if needed
};

const InfoBoxes: React.FC<InfoBoxesProps> = () => {
	return (
		<section>
			<div className="container-xl lg:container m-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
					<InfoBox
						heading="For Renters"
						backgroundColor="bg-gray-100"
						buttonInfo={{
							text: "Browse Reports",
							link: "/reports",
							backgroundColor: "bg-black",
						}}
					>
						Discover trips or post your own!
					</InfoBox>
					<InfoBox
						heading="For Trip Report Authors"
						backgroundColor="bg-black"
						buttonInfo={{
							text: "Add Report",
							link: "/reports/add",
							backgroundColor: "bg-black",
						}}
					>
						Share your trips and inspire other adventurers!
					</InfoBox>
				</div>
			</div>
		</section>
	);
};
export default InfoBoxes;
