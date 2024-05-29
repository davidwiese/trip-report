"use client";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";

const ProfileButton = () => {
	const { data: session } = useSession();
	const profileImage = session?.user?.image;

	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<button
					type="button"
					className="relative flex items-center justify-center h-10 w-10 rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
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
							<FaUser className="h-5 w-auto" />
						</AvatarFallback>
					</Avatar>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem className="cursor-pointer">
					<Link
						href="/profile"
						className="block px-4 py-2 text-sm text-gray-700"
						role="menuitem"
						tabIndex={-1}
						id="user-menu-item-0"
						onClick={() => {
							setIsProfileMenuOpen(false);
						}}
					>
						Profile
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem className="cursor-pointer">
					<Link
						href="/reports/saved"
						className="block px-4 py-2 text-sm text-gray-700"
						role="menuitem"
						tabIndex={-1}
						id="user-menu-item-2"
						onClick={() => {
							setIsProfileMenuOpen(false);
						}}
					>
						Saved Reports
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="cursor-pointer">
					<button
						onClick={() => {
							setIsProfileMenuOpen(false);
							signOut();
						}}
						className="block px-4 py-2 text-sm text-gray-700"
						role="menuitem"
						tabIndex={-1}
						id="user-menu-item-2"
					>
						Sign Out
					</button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ProfileButton;
