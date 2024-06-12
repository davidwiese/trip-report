"use client";

type SubmitButtonProps = {
	isSubmitting: boolean;
	pendingText: string;
	text: string;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({
	isSubmitting,
	pendingText,
	text,
}) => {
	return (
		<button
			className="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
			type="submit"
			disabled={isSubmitting}
		>
			{isSubmitting ? pendingText : text}
		</button>
	);
};

export default SubmitButton;
