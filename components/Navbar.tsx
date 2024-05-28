"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import logo from "@/assets/images/logo_fill.png";
import profileDefault from "@/assets/images/profile.png";
import { FaGoogle } from "react-icons/fa";
import { IoIosNotificationsOutline } from "react-icons/io";
import {
	signIn,
	signOut,
	useSession,
	getProviders,
	LiteralUnion,
	ClientSafeProvider,
} from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers/index";
import UnreadMessageCount from "@/components/UnreadMessageCount";

type NavbarProps = {
	// Add any props here if needed
};

const Navbar: React.FC<NavbarProps> = () => {
	const { data: session } = useSession();
	const profileImage = session?.user?.image;

	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
	const [providers, setProviders] = useState<Record<
		LiteralUnion<BuiltInProviderType, string>,
		ClientSafeProvider
	> | null>(null);

	const pathname = usePathname();

	useEffect(() => {
		const setAuthProviders = async () => {
			const res = await getProviders();
			setProviders(res);
		};

		setAuthProviders();
		// Close mobile menu if viewport size is changed
		window.addEventListener("resize", () => {
			setIsMobileMenuOpen(false);
		});
	}, []);

	const linkClasses = (href: string) => {
		const isActive = pathname === href;
		return isActive ? buttonVariants() : buttonVariants({ variant: "ghost" });
	};

	return (
		<nav className="bg-white border-b border-gray-500">
			<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
				<div className="relative flex h-20 items-center justify-between">
					<div className="absolute inset-y-0 left-0 flex items-center md:hidden">
						{/* <!-- Mobile menu button--> */}
						<button
							onClick={() => setIsMobileMenuOpen((prev) => !prev)}
							type="button"
							id="mobile-dropdown-button"
							className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
							aria-controls="mobile-menu"
							aria-expanded={isMobileMenuOpen}
						>
							<span className="absolute -inset-0.5"></span>
							<span className="sr-only">Open main menu</span>
							<svg
								className="block h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
								/>
							</svg>
						</button>
					</div>

					<div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
						{/* <!-- Logo --> */}
						<Link className="flex flex-shrink-0 items-center" href="/">
							<Image className="h-10 w-auto" src={logo} alt="Trip Report" />

							<span className="hidden md:block text-black text-2xl font-bold ml-2">
								Trip Report
							</span>
						</Link>
						{/* <!-- Desktop Menu Hidden below md screens --> */}
						<div className="hidden md:ml-6 md:block">
							<div className="flex space-x-2">
								<Link href="/" className={linkClasses("/")}>
									Home
								</Link>
								<Link href="/reports" className={linkClasses("/reports")}>
									Reports
								</Link>
								{session && (
									<Link
										href="/reports/add"
										className={linkClasses("/reports/add")}
									>
										Add Report
									</Link>
								)}
							</div>
						</div>
					</div>

					{/* <!-- Right Side Menu (Logged Out) --> */}
					{!session && (
						<div className="hidden md:block md:ml-6">
							<div className="flex items-center">
								<Link
									href="/auth/signin"
									className="flex items-center text-white bg-gray-700 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
								>
									<FaGoogle className="text-white mr-2" />
									<span>Login or Register</span>
								</Link>
							</div>
						</div>
					)}

					{/* <!-- Right Side Menu (Logged In) --> */}
					{session && (
						<div className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
							<Link href="/messages" className="relative group">
								<button
									type="button"
									className="relative flex items-center justify-center h-10 w-10 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
								>
									<span className="absolute -inset-1.5"></span>
									<span className="sr-only">View notifications</span>
									<svg
										className="h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
										/>
									</svg>
								</button>
								<UnreadMessageCount />
							</Link>
							{/* <!-- Profile dropdown button --> */}
							<div className="relative ml-3">
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
										<AvatarImage
											src={`${profileImage}` || `${profileDefault}`}
											alt="User profile image"
										/>
									</Avatar>
								</button>
								<div>
									{/* <!-- Profile dropdown --> */}
									{isProfileMenuOpen && (
										<div
											id="user-menu"
											className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
											role="menu"
											aria-orientation="vertical"
											aria-labelledby="user-menu-button"
											tabIndex={-1}
										>
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
												Your Profile
											</Link>
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
										</div>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* <!-- Mobile menu, show/hide based on menu state. --> */}
			{isMobileMenuOpen && (
				<div id="mobile-menu">
					<div className="flex flex-col items-stretch space-y-1 px-2 pb-3 pt-2">
						<Link href="/" className={linkClasses("/")}>
							Home
						</Link>
						<Link href="/reports" className={linkClasses("/reports")}>
							Reports
						</Link>
						{session && (
							<Link href="/reports/add" className={linkClasses("/reports/add")}>
								Add Report
							</Link>
						)}

						{!session && (
							<Link
								href="/auth/signin"
								className="flex justify-center items-center text-white bg-gray-700 hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
							>
								<FaGoogle className="text-white mr-2" />
								<span>Login or Register</span>
							</Link>
						)}
					</div>
				</div>
			)}
		</nav>
	);
};
export default Navbar;
