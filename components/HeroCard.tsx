import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

type HeroCardProps = {
	icon: JSX.Element;
	title: string;
	description: string;
};

const HeroCard: React.FC<HeroCardProps> = ({ icon, title, description }) => {
	return (
		<Card
			className="w-full text-center bg-black text-white"
			style={{ boxShadow: "0 0 3px 1px rgba(255, 255, 255, 0.5)" }}
		>
			<CardHeader className="flex flex-col items-center">
				<div className="text-4xl mb-1">{icon}</div>
				<CardTitle className="font-bold text-xl mb-2">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<CardDescription className="text-gray-300">
					{description}
				</CardDescription>
			</CardContent>
		</Card>
	);
};

export default HeroCard;
