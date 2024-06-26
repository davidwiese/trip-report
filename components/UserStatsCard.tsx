import { User as UserType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import profileDefault from "@/assets/images/profile.png";
import { montserrat } from "@/app/fonts";

type UserStatsCardProps = {
	user: UserType;
};

const UserStatsCard: React.FC<UserStatsCardProps> = ({ user }) => {
	return (
		<Card className="bg-white rounded-xl shadow-md p-6">
			<CardContent>
				<div className="flex flex-col items-center">
					<Image
						className="rounded-full mb-4"
						src={user.image || profileDefault}
						alt="User"
						width={100}
						height={100}
					/>
					<p className="text-gray-600 mb-2">
						<span className="font-bold">Name:</span> {user.username}
					</p>
					<p className="text-gray-600 mb-4">
						<span className="font-bold">Email:</span> {user.email}
					</p>
					{user.bio && (
						<p className="text-gray-600 mb-4">
							<span className="font-bold">Bio:</span> {user.bio}
						</p>
					)}
					<div className="w-full mt-4">
						<p className="text-gray-600 mb-2">
							<span className="font-bold">Total Reports:</span>{" "}
							{user.totalReports}
						</p>
						<p className="text-gray-600 mb-2">
							<span className="font-bold">Total Distance:</span>{" "}
							{user.totalDistance.toFixed(2)} miles
						</p>
						<p className="text-gray-600 mb-2">
							<span className="font-bold">Total Elevation Gain:</span>{" "}
							{user.totalElevationGain.toFixed(0)} ft
						</p>
						<p className="text-gray-600 mb-2">
							<span className="font-bold">Total Elevation Loss:</span>{" "}
							{user.totalElevationLoss.toFixed(0)} ft
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default UserStatsCard;
