"use client";

import addMessage from "@/app/actions/addMessage";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";

type ProfileContactFormProps = {
	recipientId: string;
};

// NOTE: Using a separate component for our submit button allows us to use the
// useFormStatus hook to give the user feedback about sending a message, in the
// button itself.
// https://react.dev/reference/react-dom/hooks/useFormStatus

function SubmitMessageButton() {
	const status = useFormStatus();
	return (
		<button
			className="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline flex items-center justify-center"
			type="submit"
		>
			<FaPaperPlane className="mr-2" />{" "}
			{status.pending ? "Sending..." : "Send Message"}
		</button>
	);
}

const ProfileContactForm: React.FC<ProfileContactFormProps> = ({
	recipientId,
}) => {
	const { isSignedIn, user } = useUser();
	// NOTE: use the useFormState hook to know when form has submitted.
	// https://react.dev/reference/react-dom/hooks/useFormState
	const [submitState, formAction] = useFormState(addMessage, {
		error: "",
		submitted: false,
	});
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (submitState.error) {
			toast.error(submitState.error);
			// Check for specific error and reset form if needed
			if (
				submitState.error === "You can not send a message to yourself" &&
				formRef.current
			) {
				formRef.current.reset(); // Reset the form using ref
			}
		}
		if (submitState.submitted) {
			toast.success("Message sent successfully");
		}
	}, [submitState]);

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h3 className="text-xl font-bold mb-6">Contact User</h3>
			{!isSignedIn ? (
				<p>You must be logged in to send a message</p>
			) : submitState.submitted ? (
				<p className="text-green-500 mb-4">
					Your message has been sent successfully
				</p>
			) : (
				<form ref={formRef} action={formAction}>
					{/* Hidden input to add the recipient to our FormData submission */}
					<input
						type="hidden"
						id="recipient"
						name="recipient"
						defaultValue={recipientId}
					/>
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
							name="name"
							type="text"
							placeholder="Enter your name"
							required
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
							name="email"
							type="email"
							placeholder="Enter your email"
							required
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
							name="message"
							placeholder="Enter your message"
							required
							maxLength={4000}
						></textarea>
					</div>
					<div>
						<SubmitMessageButton />
					</div>
				</form>
			)}
		</div>
	);
};
export default ProfileContactForm;
