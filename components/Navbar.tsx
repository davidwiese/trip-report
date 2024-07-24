"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import logo from "@/assets/images/logo_fill.png";
import ProfileButton from "@/components/ProfileButton";
import {
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

	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
		return isActive ? buttonVariants() : buttonVariants({ variant: "outline" });
	};

	return (
		<nav className="bg-white border-b border-gray-500">
			<div className="container mx-auto px-2 sm:px-6 lg:px-8 relative">
				<div className="relative flex h-20 items-center justify-between">
					<div className="absolute inset-y-0 left-0 flex items-center md:hidden ml-2">
						{/* <!-- Mobile menu button--> */}
						<Button
							onClick={() => setIsMobileMenuOpen((prev) => !prev)}
							type="button"
							variant={"outline"}
							id="mobile-dropdown-button"
							className="relative inline-flex items-center justify-center rounded-md p-2"
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
							<Image className="h-12 w-auto" src={logo} alt="Trip Report" />
							{/* <span className="hidden md:block text-black text-2xl font-bold ml-2">
								Trip Report
							</span> */}
						</Link>
					</div>

					{/* Centered Navigation Links */}
					<div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-2">
						<Link
							href="/"
							className={`${linkClasses("/")} w-[110px] text-center`}
						>
							Home
						</Link>
						<Link
							href="/reports"
							className={`${linkClasses("/reports")} w-[110px] text-center`}
						>
							Reports
						</Link>
						{session && (
							<Link
								href="/reports/add"
								className={`${linkClasses(
									"/reports/add"
								)} w-[110px] text-center`}
							>
								Create Report
							</Link>
						)}
					</div>

					{/* Right Side Menu */}
					<div className="flex items-center justify-end flex-1">
						{session ? (
							<>
								<Link
									tabIndex={-1}
									href="/messages"
									className="relative group rounded-full focus:bg-accent focus:text-accent-foreground"
								>
									<Button
										onClick={(e) => e.currentTarget.blur()}
										type="button"
										className="relative flex items-center justify-center h-10 w-10 rounded-full text-white border border-black bg-black p-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
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
									</Button>
									<UnreadMessageCount />
								</Link>
								<div className="relative mx-2 flex items-center rounded-full">
									<ProfileButton />
								</div>
							</>
						) : (
							pathname !== "/auth/signin" && (
								<Button asChild variant={"secondary"}>
									<Link
										href="/auth/signin"
										className="flex justify-center items-center px-3 py-2"
									>
										<span>Login or Register</span>
									</Link>
								</Button>
							)
						)}
					</div>
				</div>
			</div>

			{/* Mobile menu, show/hide based on menu state. */}
			{isMobileMenuOpen && (
				<div id="mobile-menu">
					<div className="flex flex-col items-stretch space-y-1 px-2 pb-3 pt-2">
						<Link href="/" className={`${linkClasses("/")} w-full text-center`}>
							Home
						</Link>
						<Link
							href="/reports"
							className={`${linkClasses("/reports")} w-full text-center`}
						>
							Reports
						</Link>
						{session && (
							<Link
								href="/reports/add"
								className={`${linkClasses("/reports/add")} w-full text-center`}
							>
								Add Report
							</Link>
						)}

						{!session && pathname !== "/auth/signin" && (
							<Button asChild variant={"secondary"}>
								<Link
									href="/auth/signin"
									className="flex justify-center items-center px-3 py-2"
								>
									<span>Login or Register</span>
								</Link>
							</Button>
						)}
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
