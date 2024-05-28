"use client";
import ClipLoader from "react-spinners/ClipLoader";

type LoadingPageProps = {
	// Add any props here if needed
};

const override = {
	display: "block",
	margin: "100px auto",
};

const LoadingPage: React.FC<LoadingPageProps> = () => {
	return (
		<ClipLoader
			color="#000"
			cssOverride={override}
			size={150}
			aria-label="Loading spinner"
		/>
	);
};
export default LoadingPage;
