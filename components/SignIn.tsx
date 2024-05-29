"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClientSafeProvider, LiteralUnion } from "next-auth/react";
import { Button } from "@/components/ui/button";

// Define the BuiltInProviderType type directly
type BuiltInProviderType =
	| "credentials"
	| "email"
	| "phone"
	| "sms"
	| "other"
	| string;

type SignInProps = {};

export default function SignIn({}: SignInProps) {
	const [providers, setProviders] = useState<Record<
		LiteralUnion<BuiltInProviderType, string>,
		ClientSafeProvider
	> | null>(null);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSignUp, setIsSignUp] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProviders = async () => {
			const res = await getProviders();
			setProviders(res);
		};

		fetchProviders();
	}, []);

	const handleCredentialsSubmit = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		setError(null); // Reset error state

		if (isSignUp && password !== confirmPassword) {
			setError("Passwords do not match");
			toast.error("Passwords do not match");
			return;
		}

		const result = await signIn("credentials", {
			redirect: false,
			email,
			password,
			callbackUrl: "/",
			isSignUp: isSignUp.toString(),
		});

		if (result) {
			if (result.error) {
				setError(result.error);
				toast.error(result.error);
			} else if (result.url) {
				window.location.href = result.url;
			}
		} else {
			setError("An unexpected error occurred.");
			toast.error("An unexpected error occurred.");
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10">
			<div className="bg-white p-6 rounded-lg shadow-md">
				<h2 className="text-2xl font-bold mb-4 text-center">
					{isSignUp ? "Sign Up" : "Sign In"}
				</h2>
				{error && <p className="text-red-500 text-center">{error}</p>}
				{providers &&
					Object.values(providers).map((provider) => {
						if (provider.id === "credentials") {
							return (
								<form
									key="credentials"
									onSubmit={handleCredentialsSubmit}
									className="space-y-4"
								>
									<div>
										<label className="block text-gray-700 mt-4">Email</label>
										<input
											type="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
											className="border rounded w-full py-2 px-3"
										/>
									</div>
									<div>
										<label className="block text-gray-700">Password</label>
										<input
											type="password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
											className="border rounded w-full py-2 px-3"
										/>
									</div>
									{isSignUp && (
										<div>
											<label className="block text-gray-700">
												Confirm Password
											</label>
											<input
												type="password"
												value={confirmPassword}
												onChange={(e) => setConfirmPassword(e.target.value)}
												required
												className="border rounded w-full py-2 px-3"
											/>
										</div>
									)}
									<Button
										type="submit"
										className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-600"
									>
										{isSignUp ? "Sign Up" : "Sign In"}
									</Button>
									<p className="text-center mt-4">
										{isSignUp
											? "Already have an account?"
											: "Don't have an account?"}{" "}
										<Button
											variant={"ghost"}
											className="text-gray-700 px-1"
											onClick={() => setIsSignUp((prev) => !prev)}
										>
											{isSignUp ? "Sign In" : "Sign Up"}
										</Button>
									</p>
								</form>
							);
						} else {
							return (
								<div key={provider.name} className="mt-4 mb-4">
									<Button
										onClick={() => signIn(provider.id, { callbackUrl: "/" })}
										variant={"secondary"}
										className="w-full"
									>
										Sign in with {provider.name}
									</Button>
								</div>
							);
						}
					})}
			</div>
		</div>
	);
}
