import deleteReport from "@/app/actions/deleteReport";
import { Button } from "@/components/ui/button";
import { Report as ReportType } from "@/types";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";

type DeleteButtonProps = {
	report: ReportType;
};

const DeleteButton: React.FC<DeleteButtonProps> = ({ report }) => {
	const handleDeleteReport = async (reportId: string) => {
		const confirmed = window.confirm(
			"Are you sure you want to delete this report?"
		);

		if (!confirmed) return;

		await deleteReport(reportId);

		toast.success("Report Deleted");
	};

	return (
		<Button
			onClick={() => handleDeleteReport(report._id)}
			variant="destructive"
			className="flex items-center justify-center w-2/3"
		>
			<AiOutlineDelete className="mr-2 text-xl" /> Delete Report
		</Button>
	);
};

export default DeleteButton;
