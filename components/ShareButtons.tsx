"use client";
import {
	FacebookShareButton,
	TwitterShareButton,
	TelegramShareButton,
	RedditShareButton,
	EmailShareButton,
	FacebookIcon,
	TwitterIcon,
	TelegramIcon,
	RedditIcon,
	EmailIcon,
} from "react-share";
import { Report } from "@/types";

type ShareButtonsProps = {
	report: Report;
	PUBLIC_DOMAIN: string;
};

const ShareButtons: React.FC<ShareButtonsProps> = ({
	report,
	PUBLIC_DOMAIN,
}) => {
	const shareUrl = `${PUBLIC_DOMAIN}/reports/${report._id}`;

	return (
		<>
			<h3 className="text-xl font-bold text-center pt-2">Share This Report:</h3>
			<div className="flex gap-3 justify-center pb-5">
				<FacebookShareButton url={shareUrl} hashtag={`#${report.type}`}>
					<FacebookIcon size={40} round={true}></FacebookIcon>
				</FacebookShareButton>
				<TwitterShareButton
					url={shareUrl}
					title={report.name}
					hashtags={[`${report.type.replace(/\s/g, "")}`, "TripReport"]}
				>
					<TwitterIcon size={40} round={true}></TwitterIcon>
				</TwitterShareButton>
				<TelegramShareButton url={shareUrl} title={report.name}>
					<TelegramIcon size={40} round={true}></TelegramIcon>
				</TelegramShareButton>
				<RedditShareButton url={shareUrl} title={report.name}>
					<RedditIcon size={40} round={true}></RedditIcon>
				</RedditShareButton>
				<EmailShareButton
					url={shareUrl}
					subject={report.name}
					body={`Check out this trip report: ${shareUrl}`}
				>
					<EmailIcon size={40} round={true}></EmailIcon>
				</EmailShareButton>
			</div>
		</>
	);
};
export default ShareButtons;
