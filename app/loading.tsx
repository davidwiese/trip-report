"use client";
import ClipLoader from "react-spinners/ClipLoader";

type LoadingPageProps = {
	loading: boolean;
};

const override = {
	display: "block",
	margin: "100px auto",
};

const LoadingPage: React.FC<LoadingPageProps> = ({ loading }) => {
	return (
		<ClipLoader
			color="#3b82f6"
			loading={loading}
			cssOverride={override}
			size={150}
			aria-label="Loading spinner"
		/>
	);
};
export default LoadingPage;
