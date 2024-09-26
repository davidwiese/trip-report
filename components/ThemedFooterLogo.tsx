"use client";

import logoOutline from "@/public/images/logo_darkmode.png";
import logoFill from "@/public/images/logo_fill.png";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

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
				width={32}
				height={32}
				alt="Loading logo"
				className="h-8 w-auto ml-0.5"
			/>
		);
	}

	const logo = resolvedTheme === "dark" ? logoOutline : logoFill;

	return (
		<Image src={logo} alt="Trip Report" priority className="h-8 w-auto" />
	);
};

export default ThemedLogo;
