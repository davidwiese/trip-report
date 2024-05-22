"use client";
import { useSearchParams } from "next/navigation";

const AuthError = () => {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	let errorMessage;
	switch (error) {
		case "CredentialsSignin":
			errorMessage = "Invalid email or password. Please try again.";
			break;
		default:
			errorMessage = "An unknown error occurred. Please try again.";
			break;
	}

	return (
		<div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
			<h2 className="text-2xl font-bold mb-4">Sign In Error</h2>
			<p className="mb-4 text-red-500">{errorMessage}</p>
			<button
				onClick={() => window.history.back()}
				className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
			>
				Go Back
			</button>
		</div>
	);
};

export default AuthError;
