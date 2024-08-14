"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ContactFormProps {
	initialErrorMessage?: string | null;
}

export default function ContactForm({ initialErrorMessage }: ContactFormProps) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (initialErrorMessage) {
			setMessage(
				`Error encountered: ${initialErrorMessage}\n\nPlease provide any additional details about what you were doing when this error occurred:`
			);
		}
	}, [initialErrorMessage]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const response = await axios.post("/api/send", {
				name,
				email,
				message,
			});

			if (response.status === 200) {
				toast.success("Message sent successfully!");
				setName("");
				setEmail("");
				setMessage("");
				router.refresh();
			} else {
				throw new Error("Failed to send message");
			}
		} catch (error) {
			toast.error("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label htmlFor="name" className="block mb-2">
					Name
				</label>
				<input
					type="text"
					id="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
					className="w-full px-3 py-2 border rounded"
				/>
			</div>
			<div>
				<label htmlFor="email" className="block mb-2">
					Email
				</label>
				<input
					type="email"
					id="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					className="w-full px-3 py-2 border rounded"
				/>
			</div>
			<div>
				<label htmlFor="message" className="block mb-2">
					Message
				</label>
				<textarea
					id="message"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					required
					className="w-full px-3 py-2 border rounded"
					rows={6}
					maxLength={4000}
				></textarea>
			</div>
			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? "Sending..." : "Send Message"}
			</Button>
		</form>
	);
}
