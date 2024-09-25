"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

type LoadingPageProps = {};

const override = {
	display: "block",
	margin: "100px auto",
};

const LoadingPage: React.FC<LoadingPageProps> = () => {
	const [color, setColor] = useState("#000"); // Default to dark color
	const { resolvedTheme } = useTheme();

	useEffect(() => {
		// Update color when theme changes or component mounts
		setColor(resolvedTheme === "dark" ? "#fff" : "#000");
	}, [resolvedTheme]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-white dark:bg-black transition-colors duration-300">
			<ClipLoader
				color={color}
				cssOverride={override}
				size={150}
				aria-label="Loading spinner"
			/>
		</div>
	);
};

export default LoadingPage;
