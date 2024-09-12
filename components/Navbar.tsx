"use client";

import ProfileButton from "@/components/ProfileButton";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import ThemedLogo from "@/components/ThemedLogo";
import UnreadMessageCount from "@/components/UnreadMessageCount";
import { Button, buttonVariants } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { TbLogin2 } from "react-icons/tb";

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = () => {
	const { isSignedIn } = useUser();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768); // Adjust this breakpoint as needed
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	useEffect(() => {
		// Close mobile menu if viewport size is changed
		window.addEventListener("resize", () => {
			setIsMobileMenuOpen(false);
		});
	}, []);

	const linkClasses = (href: string) => {
		const isActive = pathname === href;
		return isActive ? buttonVariants() : buttonVariants({ variant: "outline" });
	};

	const messageIconClasses = () => {
		const isActive = pathname === "/messages";
		return isActive
			? "bg-black text-white hover:text-white hover:bg-primary/90"
			: "";
	};

	return (
		<nav className="bg-white dark:bg-black border-b border-gray-500 dark:border-black">
			<div className="container mx-auto px-2 sm:px-6 lg:px-8 relative">
				<div className="relative flex h-20 items-center justify-between">
					<div className="absolute inset-y-0 left-0 flex items-center md:hidden ml-2">
						{/* <!-- Mobile menu button--> */}
						<Button
							onClick={() => setIsMobileMenuOpen((prev) => !prev)}
							type="button"
							variant={"outline"}
							id="mobile-dropdown-button"
							className="relative inline-flex items-center justify-center rounded-md p-2 dark:bg-black dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
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
						</Button>
					</div>

					{/* Centered Logo */}
					<div className="absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none md:left-auto flex items-center">
						<Link
							className="flex flex-shrink-0 items-center logo-link"
							href="/"
							onClick={(e) => e.currentTarget.blur()}
						>
							<ThemedLogo />
							{/* <span className="hidden md:block text-black text-2xl font-bold ml-2">
								Trip Report
							</span> */}
						</Link>
					</div>

					{/* Centered Navigation Links */}
					<div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-2">
						<Link
							href="/"
							className={`${linkClasses(
								"/"
							)} w-[110px] text-center dark:border-white dark:border`}
						>
							Home
						</Link>
						<Link
							href="/reports"
							className={`${linkClasses(
								"/reports"
							)} w-[110px] text-center dark:border-white dark:border`}
						>
							Reports
						</Link>
						{isSignedIn && (
							<Link
								href="/reports/add"
								className={`${linkClasses(
									"/reports/add"
								)} w-[110px] text-center dark:border-white dark:border`}
							>
								Create Report
							</Link>
						)}
					</div>

					{/* Right Side Menu */}
					<div className="flex items-center justify-end flex-1">
						<ThemeSwitcher />
						{isSignedIn ? (
							<>
								<Link
									tabIndex={-1}
									href="/messages"
									className="relative group rounded-full focus:bg-accent focus:text-accent-foreground"
								>
									<Button
										onClick={(e) => e.currentTarget.blur()}
										variant="outline"
										type="button"
										size="icon"
										className={`relative flex items-center justify-center h-10 w-10 rounded-full bg-background hover:bg-accent hover:text-accent-foreground ${messageIconClasses()}`}
									>
										<span className="absolute -inset-1.5"></span>
										<span className="sr-only">
											View notifications and messages
										</span>
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
									</Button>
									<UnreadMessageCount />
								</Link>
								<div className="relative mx-2 flex items-center rounded-full">
									<ProfileButton />
								</div>
							</>
						) : (
							pathname !== "/auth/signin" && (
								<SignInButton mode="modal">
									{isMobile ? (
										<Button
											variant="outline"
											size="icon"
											className="dark:bg-black dark:border-white dark:hover:bg-white"
										>
											<TbLogin2 className="h-6 w-6 dark:text-white dark:hover:text-black" />
											<span className="sr-only">Login or Register</span>
										</Button>
									) : (
										<Button variant="outline">Login or Register</Button>
									)}
								</SignInButton>
							)
						)}
					</div>
				</div>
			</div>

			{/* Mobile menu, show/hide based on menu state. */}
			{isMobileMenuOpen && (
				<div id="mobile-menu">
					<div className="flex flex-col items-stretch space-y-1 px-2 pb-3 pt-2">
						<Link
							href="/"
							className={`${linkClasses(
								"/"
							)} w-full text-center dark:border-white dark:border`}
						>
							Home
						</Link>
						<Link
							href="/reports"
							className={`${linkClasses(
								"/reports"
							)} w-full text-center dark:border-white dark:border`}
						>
							Reports
						</Link>
						{isSignedIn && (
							<Link
								href="/reports/add"
								className={`${linkClasses(
									"/reports/add"
								)} w-full text-center dark:border-white dark:border`}
							>
								Add Report
							</Link>
						)}

						{!isSignedIn && pathname !== "/auth/signin" && (
							<SignInButton mode="modal">
								<Button variant="outline" className="w-full justify-center">
									<TbLogin2 className="h-6 w-6 mr-1" />
									Login or Register
								</Button>
							</SignInButton>
						)}
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
