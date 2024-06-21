import { RxDownload } from "react-icons/rx";
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
				href={`/api/download?url=${encodeURIComponent(
					report.gpxKmlFile.url
				)}&filename=${encodeURIComponent(originalFilename)}`}
				className="flex items-center"
			>
				<RxDownload className="mr-2 text-xl" />
				Download GPX File
			</a>
		</Button>
	);
};

export default DownloadButton;
