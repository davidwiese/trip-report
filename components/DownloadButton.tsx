import { FaDownload } from "react-icons/fa";
import { Button } from "@/components/ui/download-button";
import { Report as ReportType } from "@/types";

type DownloadButtonProps = {
	report: ReportType;
};

const DownloadButton: React.FC<DownloadButtonProps> = ({ report }) => {
	if (!report.gpxKmlFile) {
		return null;
	}

	const originalFilename = report.gpxKmlFile.originalFilename;

	return (
		<Button asChild variant="outline">
			<a
				href={report.gpxKmlFile.url}
				download={originalFilename}
				className="flex items-center"
			>
				<FaDownload className="mr-2" />
				Download GPX/KML
			</a>
		</Button>
	);
};

export default DownloadButton;
