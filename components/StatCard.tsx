// components/StatCard.tsx
import React from "react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
	icon: React.ReactNode;
	label: string;
	value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => (
	<Card className="flex items-center justify-center text-center p-2 min-w-[100px] sm:min-w-[140px]">
		<div className="flex items-center space-x-2 w-full justify-center">
			{icon}
			<div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 w-full justify-center">
				<span className="font-medium text-xs sm:text-sm hidden sm:block">
					{label}:
				</span>
				<span className="text-sm sm:text-md">{value}</span>
			</div>
		</div>
	</Card>
);

export default StatCard;
