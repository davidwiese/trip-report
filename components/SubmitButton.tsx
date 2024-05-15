"use client";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
	pendingText?: string;
	text?: string;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({
	pendingText = "Adding Report...",
	text = "Add Report",
}) => {
	const status = useFormStatus();
	return (
		<button
			className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
			type="submit"
			disabled={status.pending}
		>
			{status.pending ? pendingText : text}
		</button>
	);
};

export default SubmitButton;
