import Link from "next/link";

type ButtonInfo = {
	link: string;
	backgroundColor: string;
	text: string;
};

type InfoBoxProps = {
	heading: string;
	backgroundColor: string;
	textColor?: string;
	buttonInfo: ButtonInfo;
	children: string;
};

const InfoBox: React.FC<InfoBoxProps> = ({
	heading,
	backgroundColor = "bg-gray-100",
	textColor = "text-gray-800",
	buttonInfo,
	children,
}) => {
	return (
		<div className={`${backgroundColor} p-6 rounded-lg shadow-md`}>
			<h2 className={`${textColor} text-2xl font-bold`}>{heading}</h2>
			<p className={`${textColor} first-line:mt-2 mb-4`}>{children}</p>
			<Link
				href={buttonInfo.link}
				className={`inline-block ${buttonInfo.backgroundColor} text-white rounded-lg px-4 py-2 hover:opacity-80`}
			>
				{buttonInfo.text}
			</Link>
		</div>
	);
};
export default InfoBox;
