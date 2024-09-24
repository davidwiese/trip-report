"use client";

import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useTheme } from "next-themes";

type LoadingPageProps = {};

const override = {
	display: "block",
	margin: "100px auto",
};

const LoadingPage: React.FC<LoadingPageProps> = () => {
	const { theme } = useTheme(); // Directly get the active theme
	const [mounted, setMounted] = useState(false);

	// Ensure the component is mounted to avoid SSR issues
	useEffect(() => {
		setMounted(true);
	}, []);

	// Render nothing until the component is mounted
	if (!mounted) {
		return null;
	}

	// Set spinner color based on theme, default to light mode if theme isn't defined
	const spinnerColor = theme === "dark" ? "#fff" : "#000";

	return (
		<div
			className={`min-h-screen flex items-center justify-center ${
				theme === "dark" ? "bg-black" : "bg-white"
			}`}
		>
			<ClipLoader
				color={spinnerColor}
				cssOverride={override}
				size={150}
				aria-label="Loading spinner"
			/>
		</div>
	);
};

export default LoadingPage;
