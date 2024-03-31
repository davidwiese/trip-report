"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import profileDefault from "@/assets/images/profile.png";
import Spinner from "@/components/Spinner";

type ProfilePageProps = {
	// Add any props here if needed
};

// Extend the Session type to include the user property with an id field
interface CustomSession extends Session {
	user?: {
		id?: string;
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
}

const ProfilePage: React.FC<ProfilePageProps> = () => {
	const { data: session } = useSession();
	const profileImage = session?.user?.image;
	const profileName = session?.user?.name;
	const profileEmail = session?.user?.email;

	const [reports, setReports] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUserReports = async (userId: string) => {
			if (!userId) {
				return;
			}

			try {
				const res = await fetch(`/api/reports/user/${userId}`);
				if (res.status === 200) {
					const data = await res.json();
					setReports(data);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};

		// Fetch user reports when session is available
		if (session?.user?.id) {
			fetchUserReports(session.user.id);
		}
	}, [session]);

	const handleDeleteReport = () => {};

	return (
		<section className="bg-blue-50">
			<div className="container m-auto py-24">
				<div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
					<h1 className="text-3xl font-bold mb-4">Your Profile</h1>
					<div className="flex flex-col md:flex-row">
						<div className="md:w-1/4 mx-20 mt-10">
							<div className="mb-4">
								<Image
									className="h-32 w-32 md:h-48 md:w-48 rounded-full mx-auto md:mx-0"
									src={profileImage || profileDefault}
									alt="User"
									width={200}
									height={200}
								/>
							</div>
							<h2 className="text-2xl mb-4">
								<span className="font-bold block">Name: </span> {profileName}
							</h2>
							<h2 className="text-2xl">
								<span className="font-bold block">Email: </span> {profileEmail}
							</h2>
						</div>

						<div className="md:w-3/4 md:pl-4">
							<h2 className="text-xl font-semibold mb-4">Your Listings</h2>
							{!loading && reports.length === 0 && (
								<p>You have no trip reports</p>
							)}
							{loading ? (
								<Spinner loading={loading} />
							) : (
								reports.map((report) => (
									<div key={report._id} className="mb-10">
										<Link href={`/reports/${report._id}`}>
											<Image
												className="h-32 w-full rounded-md object-cover"
												src={report.images[0]}
												alt=""
												width={500}
												height={100}
												priority={true}
											/>
										</Link>
										<div className="mt-2">
											<p className="text-lg font-semibold">{report.name}</p>
											<p className="text-gray-600">
												Address: {report.location.street} {report.location.city}{" "}
												{report.location.state}
											</p>
										</div>
										<div className="mt-2">
											<Link
												href={`/reports/${report._id}/edit`}
												className="bg-blue-500 text-white px-3 py-3 rounded-md mr-2 hover:bg-blue-600"
											>
												Edit
											</Link>
											<button
												onClick={() => handleDeleteReport(report._id)}
												className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
												type="button"
											>
												Delete
											</button>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
export default ProfilePage;
