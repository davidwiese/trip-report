"use client";
import { Report } from "@/types";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";

type ReportContactFormProps = {
	report: Report;
};

const ReportContactForm: React.FC<ReportContactFormProps> = ({ report }) => {
	const { data: session } = useSession();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [message, setMessage] = useState("");
	const [wasSubmitted, setWasSubmitted] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const data = {
			name,
			email,
			phone,
			message,
			recipient: report.owner,
			report: report._id,
		};

		try {
			const res = await fetch("/api/messages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (res.status === 200) {
				toast.success("Message sent successfully");
				setWasSubmitted(true);
			} else if (res.status === 400 || res.status === 401) {
				const dataObj = await res.json();
				toast.error(dataObj.message);
			} else {
				toast.error("Error sending message");
			}
		} catch (error) {
			console.log(error);
			toast.error("Error sending message");
		} finally {
			setName("");
			setEmail("");
			setPhone("");
			setMessage("");
		}
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h3 className="text-xl font-bold mb-6">Contact Report Author</h3>
			{!session ? (
				<p>Log in to send a message</p>
			) : wasSubmitted ? (
				<p className="text-green-500 mb-4">Your message has been sent</p>
			) : (
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="name"
						>
							Name:
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="name"
							type="text"
							placeholder="Enter your name"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div className="mb-4">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="email"
						>
							Email:
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="email"
							type="email"
							placeholder="Enter your email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="mb-4">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="phone"
						>
							Phone:
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="phone"
							type="text"
							placeholder="Enter your phone number"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
						/>
					</div>
					<div className="mb-4">
						<label
							className="block text-gray-700 text-sm font-bold mb-2"
							htmlFor="message"
						>
							Message:
						</label>
						<textarea
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 h-44 focus:outline-none focus:shadow-outline"
							id="message"
							placeholder="Enter your message"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						></textarea>
					</div>
					<div>
						<button
							className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline flex items-center justify-center"
							type="submit"
						>
							<FaPaperPlane className="mr-2" /> Send Message
						</button>
					</div>
				</form>
			)}
		</div>
	);
};
export default ReportContactForm;
