"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { ClientSafeProvider, LiteralUnion } from "next-auth/react";

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

	useEffect(() => {
		const fetchProviders = async () => {
			const res = await getProviders();
			setProviders(res);
		};

		fetchProviders();
	}, []);

	const handleCredentialsSignIn = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		await signIn("credentials", {
			email,
			password,
			redirect: true,
			callbackUrl: "/",
		});
	};

	return (
		<div>
			{providers &&
				Object.values(providers).map((provider) => {
					if (provider.id === "credentials") {
						return (
							<form key="credentials" onSubmit={handleCredentialsSignIn}>
								<label>
									Email
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</label>
								<label>
									Password
									<input
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
								</label>
								<button type="submit">Sign in / Sign up with Email</button>
							</form>
						);
					} else {
						return (
							<div key={provider.name}>
								<button
									onClick={() => signIn(provider.id, { callbackUrl: "/" })}
								>
									Sign in with {provider.name}
								</button>
							</div>
						);
					}
				})}
		</div>
	);
}
