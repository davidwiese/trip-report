import Image from "next/image";

type ImageObject = {
	url: string;
	originalFilename: string;
};

type ReportHeaderImageProps = {
	image: ImageObject;
};

const ReportHeaderImage: React.FC<ReportHeaderImageProps> = ({ image }) => {
	return (
		<section>
			<div className="container-xl m-auto">
				<div className="grid grid-cols-1">
					<Image
						src={image.url}
						alt={image.originalFilename}
						className="object-cover h-[400px] w-full"
						width={0}
						height={0}
						sizes="100vw"
						priority
					/>
				</div>
			</div>
		</section>
	);
};
export default ReportHeaderImage;
