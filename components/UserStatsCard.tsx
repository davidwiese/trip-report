"use client";

import updateBio from "@/app/actions/updateBio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import tripReportLogo from "@/public/images/logo_fill.png";
import profileDefault from "@/public/images/profile.png";
import { User as UserType } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { LuMoveDownRight, LuMoveUpRight } from "react-icons/lu";
import { RxRulerHorizontal } from "react-icons/rx";
import { TbEdit } from "react-icons/tb";

type UserStatsCardProps = {
	user: UserType;
	isOwnProfile: boolean;
};

const UserStatsCard: React.FC<UserStatsCardProps> = ({
	user,
	isOwnProfile,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [bio, setBio] = useState(user.bio || "");
	const [error, setError] = useState("");

	const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setBio(e.target.value);
	};

	const handleBioSubmit = async () => {
		const result = await updateBio(bio);
		if (result.error) {
			setError(result.error);
		} else {
			setIsEditing(false);
			setError("");
		}
	};

	return (
		<Card className="bg-white dark:bg-black dark:border rounded-lg shadow-md p-6 mx-auto max-w-2xl">
			<CardContent>
				<div className="flex flex-col items-center">
					<Image
						className="rounded-full mb-4"
						src={user.image || profileDefault}
						alt="User"
						width={100}
						height={100}
					/>
					<p className="text-gray-600 dark:text-white mb-2">
						<span className="font-bold">Name:</span> {user.username || "N/A"}
					</p>
					<p className="text-gray-600 dark:text-white mb-4">
						<span className="font-bold">Email:</span> {user.email || "N/A"}
					</p>
					<div className="relative w-full mb-4">
						{isEditing ? (
							<div className="w-full">
								<textarea
									value={bio}
									onChange={handleBioChange}
									className="w-full p-2 border rounded  dark:text-white"
									rows={4}
									maxLength={330}
								/>
								<div className="flex justify-end mt-2">
									<Button
										variant="outline"
										onClick={() => setIsEditing(false)}
										className="mr-2 px-3 py-1 min-w-28"
									>
										Cancel
									</Button>
									<Button
										onClick={handleBioSubmit}
										className="px-3 py-1 min-w-28 dark:border dark:border-white"
									>
										Save
									</Button>
								</div>
							</div>
						) : (
							<div className="relative pb-8">
								{" "}
								<p className="text-gray-600 dark:text-white whitespace-pre-wrap px-[2px] pb-1">
									{bio || "No bio yet."}
								</p>
								{isOwnProfile && (
									<button
										onClick={() => setIsEditing(true)}
										className="absolute bottom-0 left-0 text-gray-600 dark:text-white flex items-center"
										aria-label="Edit bio"
									>
										<TbEdit className="text-2xl mr-1  dark:text-white" />
										<span className="underline  dark:text-white">Add/Edit</span>
									</button>
								)}
							</div>
						)}
					</div>
					{error && <p className="text-red-500 mb-4">{error}</p>}
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
								value: `${user.totalReports || 0} Reports`,
							},
							{
								icon: <RxRulerHorizontal className="inline-block text-2xl" />,
								value: `${Math.round(user.totalDistance || 0)} miles`,
							},
							{
								icon: <LuMoveUpRight className="inline-block text-2xl" />,
								value: `${Math.round(user.totalElevationGain || 0)} ft`,
							},
							{
								icon: <LuMoveDownRight className="inline-block text-2xl" />,
								value: `${Math.round(user.totalElevationLoss || 0)} ft`,
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
