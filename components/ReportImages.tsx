"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Gallery, Item, type GalleryProps } from "react-photoswipe-gallery";

type ImageObject = {
	url: string;
	originalFilename: string;
};

type ReportImagesProps = {
	images: ImageObject[];
};

function useImageDimensions(images: ImageObject[]) {
	const [dimensions, setDimensions] = useState<
		{ width: number; height: number }[]
	>([]);

	useEffect(() => {
		const loadImages = async () => {
			const newDimensions = await Promise.all(
				images.map(
					(image) =>
						new Promise<{ width: number; height: number }>((resolve) => {
							const img = new window.Image();
							img.onload = () => {
								resolve({ width: img.width, height: img.height });
							};
							img.src = image.url;
						})
				)
			);
			setDimensions(newDimensions);
		};

		loadImages();
	}, [images]);

	return dimensions;
}

const galleryOptions: GalleryProps["options"] = {
	showHideAnimationType: "fade",
	showAnimationDuration: 300,
	hideAnimationDuration: 300,
	bgOpacity: 0.8,
	spacing: 0.1,
	allowPanToNext: false,
	maxZoomLevel: 2,
	pinchToClose: false,
	closeOnVerticalDrag: true,
	padding: { top: 40, bottom: 40, left: 40, right: 40 },
	clickToCloseNonZoomable: false,
};

const ReportImages: React.FC<ReportImagesProps> = ({ images }) => {
	const imageDimensions = useImageDimensions(images);

	if (imageDimensions.length === 0) {
		return null; // or a loading indicator
	}

	return (
		<Gallery options={galleryOptions}>
			<section className="p-4">
				<div className="container mx-auto">
					{images.length === 1 ? (
						<SingleImage image={images[0]} dimensions={imageDimensions[0]} />
					) : (
						<MultipleImages images={images} imageDimensions={imageDimensions} />
					)}
				</div>
			</section>
		</Gallery>
	);
};

type ImageWithDimensions = {
	image: ImageObject;
	dimensions: { width: number; height: number };
};

const SingleImage: React.FC<ImageWithDimensions> = ({ image, dimensions }) => {
	return (
		<Item
			original={image.url}
			thumbnail={image.url}
			width={dimensions.width}
			height={dimensions.height}
		>
			{({ ref, open }) => (
				<Image
					ref={ref as any}
					onClick={open}
					src={image.url}
					alt=""
					className="object-cover h-[400px] mx-auto rounded-xl cursor-pointer"
					width={1800}
					height={400}
				/>
			)}
		</Item>
	);
};

const MultipleImages: React.FC<{
	images: ImageObject[];
	imageDimensions: { width: number; height: number }[];
}> = ({ images, imageDimensions }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{images.map((image, index) => (
				<div
					key={index}
					className={`
            ${
							images.length === 3 && index === 2
								? "md:col-span-2"
								: "md:col-span-1"
						}
          `}
				>
					<Item
						original={image.url}
						thumbnail={image.url}
						width={imageDimensions[index].width}
						height={imageDimensions[index].height}
					>
						{({ ref, open }) => (
							<Image
								ref={ref as any}
								onClick={open}
								src={image.url}
								alt=""
								className="object-cover h-[400px] w-full rounded-xl cursor-pointer"
								width={0}
								height={0}
								sizes="100vw"
							/>
						)}
					</Item>
				</div>
			))}
		</div>
	);
};

export default ReportImages;
