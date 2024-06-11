"use client";
import Image from "next/image";
import { Gallery, Item } from "react-photoswipe-gallery";

type ImageObject = {
	url: string;
	originalFilename: string;
};

type ReportImagesProps = {
	images: ImageObject[];
};

const ReportImages: React.FC<ReportImagesProps> = ({ images }) => {
	return (
		<Gallery>
			<section className="bg-blue-50 p-4">
				<div className="container mx-auto">
					{images.length === 1 ? (
						<Item
							original={images[0].url}
							thumbnail={images[0].url}
							width="1000"
							height="600"
						>
							{({ ref, open }) => (
								<Image
									ref={ref}
									onClick={open}
									src={images[0].url}
									alt=""
									className="object-cover h-[400px] mx-auto rounded-xl"
									width={1800}
									height={400}
									priority={true}
								/>
							)}
						</Item>
					) : (
						<div className="grid grid-cols-2 gap-4">
							{images.map((image, index) => (
								<div
									key={index}
									className={`
                  ${
										images.length === 3 && index === 2
											? "col-span-2"
											: "col-span-1"
									}
                `}
								>
									<Item
										original={image.url}
										thumbnail={image.url}
										width="1000"
										height="600"
									>
										{({ ref, open }) => (
											<Image
												ref={ref}
												onClick={open}
												src={image.url}
												alt=""
												className="object-cover h-[400px] w-full rounded-xl"
												width={0}
												height={0}
												sizes="100vw"
												priority={true}
											/>
										)}
									</Item>
								</div>
							))}
						</div>
					)}
				</div>
			</section>
		</Gallery>
	);
};
export default ReportImages;
