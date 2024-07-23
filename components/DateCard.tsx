import { Card } from "@/components/ui/card";

interface DateCardProps {
	icon: React.ReactNode;
	label: string;
	date: string;
}

const DateCard: React.FC<DateCardProps> = ({ icon, label, date }) => (
	<Card className="flex items-center justify-center text-center p-2 min-w-[100px] sm:min-w-[140px]">
		<div className="flex items-center space-x-2 w-full justify-center">
			{icon}
			<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 w-full justify-center">
				<span className="font-medium text-xs sm:text-sm hidden sm:block">
					{label}:
				</span>
				<span className="text-sm sm:text-md">{date}</span>
			</div>
		</div>
	</Card>
);

export default DateCard;
