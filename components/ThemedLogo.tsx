"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import logoFill from "@/public/images/logo_fill.png";
import logoOutline from "@/public/images/logo_darkmode.png";

const ThemedLogo = () => {
	const [mounted, setMounted] = useState(false);
	const { resolvedTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Image
				src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
				width={48}
				height={48}
				alt="Loading logo"
				className="h-12 w-auto"
			/>
		);
	}

	const logo = resolvedTheme === "dark" ? logoOutline : logoFill;

	return (
		<Image src={logo} alt="Trip Report" priority className="h-12 w-auto" />
	);
};

export default ThemedLogo;
