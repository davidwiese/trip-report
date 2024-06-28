"use client";
import ClipLoader from "react-spinners/ClipLoader";

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
			className={`flex items-center justify-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline ${
				isSubmitting
					? "bg-gray-400 cursor-not-allowed"
					: "bg-black hover:bg-gray-600 text-white"
			}`}
			type="submit"
			disabled={isSubmitting}
		>
			{isSubmitting && (
				<ClipLoader
					color="#000"
					size={20}
					aria-label="Loading Spinner"
					data-testid="loader"
					className="mr-2"
				/>
			)}
			{isSubmitting ? pendingText : text}
		</button>
	);
};

export default SubmitButton;
