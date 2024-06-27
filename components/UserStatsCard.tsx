import { User as UserType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import profileDefault from "@/assets/images/profile.png";
import { LuMoveUpRight, LuMoveDownRight } from "react-icons/lu";
import { RxRulerHorizontal } from "react-icons/rx";
import tripReportLogo from "@/assets/images/logo_fill.png";

type UserStatsCardProps = {
	user: UserType;
};

const UserStatsCard: React.FC<UserStatsCardProps> = ({ user }) => {
	return (
		<Card className="bg-white rounded-lg shadow-md p-6 mx-auto max-w-3xl">
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
					{user.bio && <p className="text-gray-600 mb-4">{user.bio}</p>}
					<div className="w-full mt-2 grid sm:grid-cols-2 gap-4 items-center">
						{[
							{
								icon: (
									<Image
										src={tripReportLogo}
										alt="Reports"
										width={24}
										height={24}
									/>
								),
								value: `${user.totalReports} Reports`,
							},
							{
								icon: <RxRulerHorizontal className="inline-block text-2xl" />,
								value: `${Math.round(user.totalDistance)} miles`,
							},
							{
								icon: <LuMoveUpRight className="inline-block text-2xl" />,
								value: `${Math.round(user.totalElevationGain)} ft`,
							},
							{
								icon: <LuMoveDownRight className="inline-block text-2xl" />,
								value: `${Math.round(user.totalElevationLoss)} ft`,
							},
						].map((stat, index) => (
							<Card
								key={index}
								className="flex items-center justify-center text-center p-2 min-w-[175px]"
							>
								<div className="flex items-center space-x-2 w-full justify-center">
									{stat.icon}
									<span>{stat.value}</span>
								</div>
							</Card>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default UserStatsCard;
