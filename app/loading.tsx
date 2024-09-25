"use client";

import ClipLoader from "react-spinners/ClipLoader";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type LoadingPageProps = {};

const override = {
	display: "block",
	margin: "100px auto",
};

const LoadingPage: React.FC<LoadingPageProps> = () => {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Log to check the theme and mounting state
	console.log("Resolved theme:", resolvedTheme);
	console.log("Is component mounted:", mounted);

	// Ensure the component is mounted before rendering the UI to avoid hydration issues
	useEffect(() => {
		setMounted(true);
		console.log("Component is now mounted.");
	}, []);

	// Determine default values for SSR or unmounted state
	const backgroundColor = resolvedTheme === "dark" ? "#000000" : "#FFFFFF";
	const spinnerColor = resolvedTheme === "dark" ? "#FFFFFF" : "#000000";

	// Log to check what background and spinner color are being applied
	console.log("Background color:", backgroundColor);
	console.log("Spinner color:", spinnerColor);

	// Before the component is mounted, you can assume a default, like light theme
	if (!mounted) {
		console.log("Rendering default spinner (light mode assumed).");
		return (
			<div
				style={{
					backgroundColor: "#FFFFFF",
					height: "100vh",
					width: "100vw",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<ClipLoader
					color="#000000"
					cssOverride={override}
					size={150}
					aria-label="Loading spinner"
				/>
			</div>
		);
	}

	return (
		<div
			style={{
				backgroundColor: backgroundColor,
				height: "100vh",
				width: "100vw",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
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
