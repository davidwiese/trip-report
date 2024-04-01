"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fetchReport } from "@/utils/requests";

type Fields = {
	type: string;
	name: string;
	description: string;
	location: {
		street: string;
		city: string;
		state: string;
		zipcode: string;
	};
	beds: string;
	baths: string;
	square_feet: string;
	amenities: string[];
	rates: {
		weekly: string;
		monthly: string;
		nightly: string;
	};
	seller_info: {
		name: string;
		email: string;
		phone: string;
	};
};

type ReportEditFormProps = {
	// Add any props here if needed
};

const ReportEditForm: React.FC<ReportEditFormProps> = () => {
	const { id } = useParams();
	const router = useRouter();

	const [mounted, setMounted] = useState(false);
	const [fields, setFields] = useState<Fields>({
		type: "",
		name: "",
		description: "",
		location: {
			street: "",
			city: "",
			state: "",
			zipcode: "",
		},
		beds: "",
		baths: "",
		square_feet: "",
		amenities: [],
		rates: {
			weekly: "",
			monthly: "",
			nightly: "",
		},
		seller_info: {
			name: "",
			email: "",
			phone: "",
		},
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setMounted(true);

		// Fetch report data for form
		const fetchReportData = async () => {
			try {
				const reportData = await fetchReport(id);
				setFields(reportData);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchReportData();
	}, [id]);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;

		// Check if nested report
		if (name.includes(".")) {
			const [outerKey, innerKey] = name.split(".");
			setFields((prevFields) => ({
				...prevFields,
				[outerKey]: {
					...(prevFields[outerKey as keyof Fields] as Record<string, unknown>),
					[innerKey]: value,
				},
			}));
		} else {
			// Not nested
			setFields((prevFields) => ({
				...prevFields,
				[name]: value,
			}));
		}
	};

	const handleAmenitiesChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value, checked } = e.target;

		// Clone current amenities array
		const updatedAmenities = [...fields.amenities];

		if (checked) {
			// Add value to array
			updatedAmenities.push(value);
		} else {
			// Remove value from array
			const index = updatedAmenities.indexOf(value);

			if (index !== -1) {
				updatedAmenities.splice(index, 1);
			}
		}
		// Update state with updated array
		setFields((prevFields) => ({
			...prevFields,
			amenities: updatedAmenities,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const formData = new FormData(e.target as HTMLFormElement);
			const res = await fetch(`/api/reports/${id}`, {
				method: "PUT",
				body: formData,
			});

			if (res.status === 200) {
				router.push(`/reports/${id}`);
			} else if (res.status === 401 || res.status === 403) {
				toast.error("Permission denied");
			} else {
				toast.error("Something went wrong");
			}
		} catch (error) {
			toast.error("Something went wrong");
			console.log(error);
		}
	};

	return (
		mounted &&
		!loading && (
			<form onSubmit={handleSubmit}>
				<h2 className="text-3xl text-center font-semibold mb-6">
					Edit Trip Report
				</h2>

				<div className="mb-4">
					<label htmlFor="type" className="block text-gray-700 font-bold mb-2">
						Trip Type
					</label>
					<select
						id="type"
						name="type"
						className="border rounded w-full py-2 px-3"
						required
						value={fields.type}
						onChange={handleChange}
					>
						<option value="Apartment">Apartment</option>
						<option value="Condo">Condo</option>
						<option value="House">House</option>
						<option value="Cabin Or Cottage">Cabin or Cottage</option>
						<option value="Room">Room</option>
						<option value="Studio">Studio</option>
						<option value="Other">Other</option>
					</select>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 font-bold mb-2">
						Listing Name
					</label>
					<input
						type="text"
						id="name"
						name="name"
						className="border rounded w-full py-2 px-3 mb-2"
						placeholder="eg. Beautiful Apartment In Miami"
						required
						value={fields.name}
						onChange={handleChange}
					/>
				</div>
				<div className="mb-4">
					<label
						htmlFor="description"
						className="block text-gray-700 font-bold mb-2"
					>
						Description
					</label>
					<textarea
						id="description"
						name="description"
						className="border rounded w-full py-2 px-3"
						rows={4}
						placeholder="Add an optional description of your trip"
						value={fields.description}
						onChange={handleChange}
					></textarea>
				</div>

				<div className="mb-4 bg-blue-50 p-4">
					<label className="block text-gray-700 font-bold mb-2">Location</label>
					<input
						type="text"
						id="street"
						name="location.street"
						className="border rounded w-full py-2 px-3 mb-2"
						placeholder="Street"
						value={fields.location.street}
						onChange={handleChange}
					/>
					<input
						type="text"
						id="city"
						name="location.city"
						className="border rounded w-full py-2 px-3 mb-2"
						placeholder="City"
						required
						value={fields.location.city}
						onChange={handleChange}
					/>
					<input
						type="text"
						id="state"
						name="location.state"
						className="border rounded w-full py-2 px-3 mb-2"
						placeholder="State"
						required
						value={fields.location.state}
						onChange={handleChange}
					/>
					<input
						type="text"
						id="zipcode"
						name="location.zipcode"
						className="border rounded w-full py-2 px-3 mb-2"
						placeholder="Zipcode"
						value={fields.location.zipcode}
						onChange={handleChange}
					/>
				</div>

				<div className="mb-4 flex flex-wrap">
					<div className="w-full sm:w-1/3 pr-2">
						<label
							htmlFor="beds"
							className="block text-gray-700 font-bold mb-2"
						>
							Beds
						</label>
						<input
							type="number"
							id="beds"
							name="beds"
							className="border rounded w-full py-2 px-3"
							required
							value={fields.beds}
							onChange={handleChange}
						/>
					</div>
					<div className="w-full sm:w-1/3 px-2">
						<label
							htmlFor="baths"
							className="block text-gray-700 font-bold mb-2"
						>
							Baths
						</label>
						<input
							type="number"
							id="baths"
							name="baths"
							className="border rounded w-full py-2 px-3"
							required
							value={fields.baths}
							onChange={handleChange}
						/>
					</div>
					<div className="w-full sm:w-1/3 pl-2">
						<label
							htmlFor="square_feet"
							className="block text-gray-700 font-bold mb-2"
						>
							Square Feet
						</label>
						<input
							type="number"
							id="square_feet"
							name="square_feet"
							className="border rounded w-full py-2 px-3"
							required
							value={fields.square_feet}
							onChange={handleChange}
						/>
					</div>
				</div>

				<div className="mb-4">
					<label className="block text-gray-700 font-bold mb-2">
						Amenities
					</label>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
						<div>
							<input
								type="checkbox"
								id="amenity_wifi"
								name="amenities"
								value="Wifi"
								className="mr-2"
								checked={fields.amenities.includes("Wifi")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="amenity_wifi">Wifi</label>
						</div>
						<div>
							<input
								type="checkbox"
								id="amenity_kitchen"
								name="amenities"
								value="Full Kitchen"
								className="mr-2"
								checked={fields.amenities.includes("Full Kitchen")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="amenity_kitchen">Full kitchen</label>
						</div>
						<div>
							<input
								type="checkbox"
								id="amenity_washer_dryer"
								name="amenities"
								value="Washer & Dryer"
								className="mr-2"
								checked={fields.amenities.includes("Washer & Dryer")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="amenity_washer_dryer">Washer & Dryer</label>
						</div>
						<div>
							<input
								type="checkbox"
								id="amenity_free_parking"
								name="amenities"
								value="Free Parking"
								className="mr-2"
								checked={fields.amenities.includes("Free Parking")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="amenity_free_parking">Free Parking</label>
						</div>
						<div>
							<input
								type="checkbox"
								id="amenity_pool"
								name="amenities"
								value="Swimming Pool"
								className="mr-2"
								checked={fields.amenities.includes("Swimming Pool")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="amenity_pool">Swimming Pool</label>
						</div>
						<div>
							<input
								type="checkbox"
								id="amenity_hot_tub"
								name="amenities"
								value="Hot Tub"
								className="mr-2"
								checked={fields.amenities.includes("Hot Tub")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="amenity_hot_tub">Hot Tub</label>
						</div>
						<div>
							<input
								type="checkbox"
								id="amenity_24_7_security"
								name="amenities"
								value="24/7 Security"
								className="mr-2"
								checked={fields.amenities.includes("24/7 Security")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="amenity_24_7_security">24/7 Security</label>
						</div>
						<div>
							<input
								type="checkbox"
								id="amenity_wheelchair_accessible"
								name="amenities"
								value="Wheelchair Accessible"
								className="mr-2"
								checked={fields.amenities.includes("Wheelchair Accessible")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="amenity_wheelchair_accessible">
								Wheelchair Accessible
							</label>
						</div>
						<div>
							<input
								type="checkbox"
								id="amenity_elevator_access"
								name="amenities"
								value="Elevator Access"
								className="mr-2"
								checked={fields.amenities.includes("Elevator Access")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="amenity_elevator_access">Elevator Access</label>
						</div>
						<div>
							<input
								type="checkbox"
								id="amenity_dishwasher"
								name="amenities"
								value="Dishwasher"
								className="mr-2"
								checked={fields.amenities.includes("Dishwasher")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="amenity_dishwasher">Dishwasher</label>
						</div>
						<div>
							<input
								type="checkbox"
								id="amenity_gym_fitness_center"
								name="amenities"
								value="Gym/Fitness Center"
								className="mr-2"
								checked={fields.amenities.includes("Gym/Fitness Center")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="amenity_gym_fitness_center">
								Gym/Fitness Center
							</label>
						</div>
						<div>
							<input
								type="checkbox"
								id="amenity_air_conditioning"
								name="amenities"
								value="Air Conditioning"
								className="mr-2"
								checked={fields.amenities.includes("Air Conditioning")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="amenity_air_conditioning">Air Conditioning</label>
						</div>
						<div>
							<input
								type="checkbox"
								id="amenity_balcony_patio"
								name="amenities"
								value="Balcony/Patio"
								className="mr-2"
								checked={fields.amenities.includes("Balcony/Patio")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="amenity_balcony_patio">Balcony/Patio</label>
						</div>
						<div>
							<input
								type="checkbox"
								id="amenity_smart_tv"
								name="amenities"
								value="Smart TV"
								className="mr-2"
								checked={fields.amenities.includes("Smart TV")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="amenity_smart_tv">Smart TV</label>
						</div>
						<div>
							<input
								type="checkbox"
								id="amenity_coffee_maker"
								name="amenities"
								value="Coffee Maker"
								className="mr-2"
								checked={fields.amenities.includes("Coffee Maker")}
								onChange={handleAmenitiesChange}
							/>
							<label htmlFor="amenity_coffee_maker">Coffee Maker</label>
						</div>
					</div>
				</div>

				<div className="mb-4 bg-blue-50 p-4">
					<label className="block text-gray-700 font-bold mb-2">
						Rates (Leave blank if not applicable)
					</label>
					<div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
						<div className="flex items-center">
							<label htmlFor="weekly_rate" className="mr-2">
								Weekly
							</label>
							<input
								type="number"
								id="weekly_rate"
								name="rates.weekly"
								className="border rounded w-full py-2 px-3"
								value={fields.rates.weekly || ""}
								onChange={handleChange}
							/>
						</div>
						<div className="flex items-center">
							<label htmlFor="monthly_rate" className="mr-2">
								Monthly
							</label>
							<input
								type="number"
								id="monthly_rate"
								name="rates.monthly"
								className="border rounded w-full py-2 px-3"
								value={fields.rates.monthly || ""}
								onChange={handleChange}
							/>
						</div>
						<div className="flex items-center">
							<label htmlFor="nightly_rate" className="mr-2">
								Nightly
							</label>
							<input
								type="number"
								id="nightly_rate"
								name="rates.nightly"
								className="border rounded w-full py-2 px-3"
								value={fields.rates.nightly || ""}
								onChange={handleChange}
							/>
						</div>
					</div>
				</div>

				<div className="mb-4">
					<label
						htmlFor="seller_name"
						className="block text-gray-700 font-bold mb-2"
					>
						Seller Name
					</label>
					<input
						type="text"
						id="seller_name"
						name="seller_info.name"
						className="border rounded w-full py-2 px-3"
						placeholder="Name"
						value={fields.seller_info.name}
						onChange={handleChange}
					/>
				</div>
				<div className="mb-4">
					<label
						htmlFor="seller_email"
						className="block text-gray-700 font-bold mb-2"
					>
						Seller Email
					</label>
					<input
						type="email"
						id="seller_email"
						name="seller_info.email"
						className="border rounded w-full py-2 px-3"
						placeholder="Email address"
						required
						value={fields.seller_info.email}
						onChange={handleChange}
					/>
				</div>
				<div className="mb-4">
					<label
						htmlFor="seller_phone"
						className="block text-gray-700 font-bold mb-2"
					>
						Seller Phone
					</label>
					<input
						type="tel"
						id="seller_phone"
						name="seller_info.phone"
						className="border rounded w-full py-2 px-3"
						placeholder="Phone"
						value={fields.seller_info.phone}
						onChange={handleChange}
					/>
				</div>

				<div>
					<button
						className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
						type="submit"
					>
						Update Report
					</button>
				</div>
			</form>
		)
	);
};
export default ReportEditForm;
