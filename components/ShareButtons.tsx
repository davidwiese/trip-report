import { FaShare } from "react-icons/fa";
import { Report } from "@/types";

type ShareButtonsProps = {
	report: Report;
};

const ShareButtons: React.FC<ShareButtonsProps> = ({ report }) => {
	return (
		<button className="bg-orange-500 hover:bg-orange-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center">
			<FaShare className="mr-2" /> Share Report
		</button>
	);
};
export default ShareButtons;
