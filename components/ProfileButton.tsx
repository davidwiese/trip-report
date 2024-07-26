"use client";

import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";

const ProfileButton = () => {
	const { user } = useUser();
	const { signOut } = useClerk();
	const profileImage = user?.imageUrl;

	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					type="button"
					className="h-10 w-10 p-0 rounded-full bg-none relative flex items-center justify-center"
					id="user-menu-button"
					aria-expanded={isProfileMenuOpen}
					aria-haspopup="true"
					onClick={() => setIsProfileMenuOpen((prev) => !prev)}
				>
					<span className="absolute -inset-1.5"></span>
					<span className="sr-only">Open user menu</span>
					<Avatar>
						<AvatarImage src={`${profileImage}`} alt="User profile image" />
						<AvatarFallback>
							<FaUser className="h-5 w-auto text-black" />
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem asChild>
					<Link
						href="/profile"
						className="block px-4 py-2 text-sm w-full text-left"
						role="menuitem"
						id="user-menu-item-0"
						onClick={() => {
							setIsProfileMenuOpen(false);
						}}
					>
						Profile
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link
						href="/reports/bookmarks"
						className="block px-4 py-2 text-sm w-full text-left"
						role="menuitem"
						id="user-menu-item-2"
						onClick={() => {
							setIsProfileMenuOpen(false);
						}}
					>
						Bookmarks
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Button
						onClick={() => {
							setIsProfileMenuOpen(false);
							signOut();
						}}
						className="w-full text-center"
						role="menuitem"
						id="user-menu-item-2"
					>
						Sign Out
					</Button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ProfileButton;
