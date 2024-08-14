import { Button } from "@/components/ui/download-button";
import { Report as ReportType } from "@/types";
import { RxDownload } from "react-icons/rx";

type DownloadButtonProps = {
	report: ReportType;
};

const DownloadButton: React.FC<DownloadButtonProps> = ({ report }) => {
	if (!report.gpxFile) {
		return null;
	}

	const originalFilename = report.gpxFile.originalFilename;

	return (
		<Button asChild variant="outline">
			<a
				href={`/api/download?url=${encodeURIComponent(
					report.gpxFile.url
				)}&filename=${encodeURIComponent(originalFilename)}`}
				className="flex items-center justify-center w-[183px]"
			>
				<RxDownload className="mr-2 text-xl" />
				Download GPX File
			</a>
		</Button>
	);
};

export default DownloadButton;
