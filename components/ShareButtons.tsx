"use client";

import { Report } from "@/types";
import {
	EmailIcon,
	EmailShareButton,
	FacebookIcon,
	FacebookShareButton,
	RedditIcon,
	RedditShareButton,
	TelegramIcon,
	TelegramShareButton,
	TwitterIcon,
	TwitterShareButton,
} from "react-share";

type ShareButtonsProps = {
	report: Report;
	PUBLIC_DOMAIN: string;
};

const ShareButtons: React.FC<ShareButtonsProps> = ({
	report,
	PUBLIC_DOMAIN,
}) => {
	// Here we receive a prop from our parent page component which is
	// server rendered and knows if we are deployed to Vercel or developing
	// locally

	const shareUrl = `${PUBLIC_DOMAIN}/reports/${report._id}`;

	return (
		<>
			<h3 className="text-xl font-bold text-center pt-2 mb-2">
				Share This Report:
			</h3>
			<div className="flex gap-3 justify-center pb-5">
				<FacebookShareButton url={shareUrl} hashtag={`#${report.activityType}`}>
					<FacebookIcon size={40} round={true}></FacebookIcon>
				</FacebookShareButton>
				<TwitterShareButton
					url={shareUrl}
					title={report.title}
					hashtags={[
						...report.activityType.map((activity) =>
							activity.replace(/\s/g, "")
						),
						"TripReport",
					]}
				>
					<TwitterIcon size={40} round={true}></TwitterIcon>
				</TwitterShareButton>
				<TelegramShareButton url={shareUrl} title={report.title}>
					<TelegramIcon size={40} round={true}></TelegramIcon>
				</TelegramShareButton>
				<RedditShareButton url={shareUrl} title={report.title}>
					<RedditIcon size={40} round={true}></RedditIcon>
				</RedditShareButton>
				<EmailShareButton
					url={shareUrl}
					subject={report.title}
					body={`Check out this trip report: ${shareUrl}`}
				>
					<EmailIcon size={40} round={true}></EmailIcon>
				</EmailShareButton>
			</div>
		</>
	);
};
export default ShareButtons;
