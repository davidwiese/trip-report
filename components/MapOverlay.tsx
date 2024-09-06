"use client";

import { useState, useRef, useEffect } from "react";

const MapOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isActive, setIsActive] = useState(false);
	const mapRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const currentMapRef = mapRef.current;

		const handleMouseLeave = (event: MouseEvent) => {
			if (isActive && !currentMapRef?.contains(event.relatedTarget as Node)) {
				setIsActive(false);
			}
		};

		if (currentMapRef) {
			currentMapRef.addEventListener("mouseleave", handleMouseLeave);
		}

		return () => {
			if (currentMapRef) {
				currentMapRef.removeEventListener("mouseleave", handleMouseLeave);
			}
		};
	}, [isActive, mapRef]);

	const handleOverlayClick = () => {
		setIsActive(true);
	};

	return (
		<div className="relative" ref={mapRef}>
			{!isActive && (
				<div
					className="absolute inset-0 z-10 bg-black bg-opacity-30 flex items-center justify-center cursor-pointer"
					onClick={handleOverlayClick}
				>
					<p className="text-white text-lg font-semibold">
						Click to interact with the map
					</p>
				</div>
			)}
			<div className={isActive ? "" : "pointer-events-none"}>{children}</div>
		</div>
	);
};

export default MapOverlay;
