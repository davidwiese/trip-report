"use client";

import { useEffect } from "react";

const ThemeScript = () => {
	useEffect(() => {
		const theme = localStorage.getItem("theme") || "system";
		const root = document.documentElement;

		if (
			theme === "dark" ||
			(theme === "system" &&
				window.matchMedia("(prefers-color-scheme: dark)").matches)
		) {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
	}, []);

	return null;
};

export default ThemeScript;
