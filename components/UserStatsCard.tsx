"use client";

import { User as UserType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import profileDefault from "@/assets/images/profile.png";
import { LuMoveUpRight, LuMoveDownRight } from "react-icons/lu";
import { RxRulerHorizontal } from "react-icons/rx";
import tripReportLogo from "@/assets/images/logo_fill.png";
import { useState } from "react";
import updateBio from "@/app/actions/updateBio";
import { TbEdit } from "react-icons/tb";
import { Button } from "@/components/ui/button";

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
		<Card className="bg-white rounded-lg shadow-md p-6 mx-auto max-w-2xl">
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
					<div className="relative w-full mb-4">
						{isEditing ? (
							<div className="w-full">
								<textarea
									value={bio}
									onChange={handleBioChange}
									className="w-full p-2 border rounded"
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
										className="px-3 py-1 min-w-28"
									>
										Save
									</Button>
								</div>
							</div>
						) : (
							<div className="relative pb-8">
								{" "}
								<p className="text-gray-600 whitespace-pre-wrap px-[2px] pb-1">
									{bio || "No bio yet."}
								</p>
								{isOwnProfile && (
									<button
										onClick={() => setIsEditing(true)}
										className="absolute bottom-0 left-0 text-gray-600 flex items-center"
										aria-label="Edit bio"
									>
										<TbEdit className="text-2xl mr-1" />
										<span className="underline">Add/Edit</span>
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
