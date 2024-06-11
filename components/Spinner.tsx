"use client";
import ClipLoader from "react-spinners/ClipLoader";

type SpinnerProps = {
	loading: boolean;
};

const override = {
	display: "block",
	margin: "100px auto",
};

const Spinner: React.FC<SpinnerProps> = () => {
	return (
		<ClipLoader
			color="#000"
			cssOverride={override}
			size={150}
			aria-label="Loading spinner"
		/>
	);
};
export default Spinner;
