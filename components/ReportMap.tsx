"use client";
import { useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker } from "react-map-gl";
import { setDefaults, fromAddress, OutputFormat } from "react-geocode";
import Spinner from "./Spinner";
import Image from "next/image";
import pin from "@/assets/images/pin.svg";
import { Report } from "@/types";

type ReportMapProps = {
	report: Report;
};

const ReportMap: React.FC<ReportMapProps> = ({ report }) => {
	const [lat, setLat] = useState<number | null>(null);
	const [lng, setLng] = useState<number | null>(null);
	const [viewport, setViewport] = useState({
		latitude: 0,
		longitude: 0,
		zoom: 12,
		width: "100%",
		height: "500px",
	});
	const [loading, setLoading] = useState(true);
	const [geocodingError, setGeocodingError] = useState(false);

	setDefaults({
		key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
		language: "en",
		region: "us",
		outputFormat: OutputFormat.JSON,
	});

	useEffect(() => {
		const fetchCoords = async () => {
			try {
				const res = await fromAddress(
					`${report.location.street} ${report.location.city} ${report.location.state} ${report.location.zipcode}`
				);
				// Check for results
				if (res.results.length === 0) {
					// No results found
					setGeocodingError(true);
					setLoading(false);
					return;
				}
				const { lat, lng } = res.results[0].geometry.location;
				setLat(lat);
				setLng(lng);
				setViewport({
					...viewport,
					latitude: lat,
					longitude: lng,
				});

				setLoading(false);
			} catch (error) {
				console.log(error);
				setGeocodingError(true);
				setLoading(false);
			}
		};

		fetchCoords();
	}, [
		report.location.city,
		report.location.state,
		report.location.street,
		report.location.zipcode,
		viewport,
	]);

	if (loading) return <Spinner loading={loading} />;

	// Handle case where geocoding failed
	if (geocodingError) {
		return <div className="text-xl">No location data found</div>;
	}

	return (
		!loading && (
			<Map
				mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
				mapLib={import("mapbox-gl")}
				initialViewState={{
					longitude: lng ?? 0,
					latitude: lat ?? 0,
					zoom: 15,
				}}
				style={{
					width: "100%",
					height: 500,
				}}
				mapStyle="mapbox://styles/mapbox/streets-v9"
			>
				{lat && lng && (
					<Marker longitude={lng} latitude={lat} anchor="bottom">
						<Image src={pin} alt="location" width={40} height={40} />
					</Marker>
				)}
			</Map>
		)
	);
};
export default ReportMap;
