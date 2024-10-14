import MapOverlay from "@/components/MapOverlay";
import ReportDetails from "@/components/ReportDetails";
import ReportHeaderImage from "@/components/ReportHeaderImage";
import ReportImages from "@/components/ReportImages";
import ShareButtons from "@/components/ShareButtons";
import connectDB from "@/config/database";
import Report from "@/models/Report";
import { Report as ReportType, User as UserType } from "@/types";
import { convertToSerializableObject } from "@/utils/convertToObject";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { auth } from "@clerk/nextjs/server";
import { isValidObjectId } from "mongoose";
import { Metadata, ResolvingMetadata } from "next";
import Script from "next/script";

type ReportPageProps = {
	params: {
		id: string;
	};
};

function generateJsonLd(
	report: ReportType & { owner: UserType },
	fullUrl: string
) {
	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: report.title,
		description: report.description,
		image: report.images?.map((img) => img.url) || [],
		datePublished: report.createdAt,
		dateModified: report.updatedAt,
		author: {
			"@type": "Person",
			name: report.owner.username,
		},
		publisher: {
			"@type": "Organization",
			name: "Trip Report",
			logo: {
				"@type": "ImageObject",
				url: "https://www.tripreport.co/og.png",
			},
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": fullUrl,
		},
		keywords: report.activityType.join(", "),
		articleSection: "Trip Reports",
		inLanguage: "en-US",
		locationCreated: {
			"@type": "Place",
			name: `${report.location.objective}, ${report.location.localArea}, ${report.location.region}, ${report.location.country}`,
		},
	};
}

const JsonLd = ({ data }: { data: any }) => (
	<Script
		id="json-ld"
		type="application/ld+json"
		dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
	/>
);

export async function generateMetadata(
	{ params }: ReportPageProps,
	parent: ResolvingMetadata
): Promise<Metadata> {
	try {
		await connectDB();

		// Validate the ID
		if (!isValidObjectId(params.id)) {
			console.error(`Invalid report ID: ${params.id}`);
			return {
				title: "Invalid Report ID",
				description: "The provided report ID is invalid.",
			};
		}

		// Fetch the report data and populate the owner field
		const report = (await Report.findById(params.id)
			.populate("owner")
			.lean()) as (ReportType & { owner: UserType }) | null;

		if (!report) {
			return {
				title: "Report Not Found",
				description: "The requested report does not exist.",
			};
		}

		const imageUrls =
			report.images?.map((img: { url: string }) => img.url) || [];

		const keywords = [
			report.title,
			...report.activityType,
			report.location.country,
			report.location.region,
			report.location.localArea,
			report.location.objective,
			"trip report",
		].filter(Boolean);

		const baseUrl = getBaseUrl();
		const fullUrl = `${baseUrl}/reports/${params.id}`;

		const jsonLd = generateJsonLd(report, fullUrl);

		return {
			title: `${report.title} | Trip Report`,
			description: `${report.description.slice(0, 250)}...`,
			alternates: {
				canonical: `https://www.tripreport.co/reports/${params.id}`,
			},
			keywords: keywords.join(", "),
			openGraph: {
				title: report.title,
				description: report.description,
				type: "article",
				url: fullUrl,
				siteName: "Trip Report",
				authors: [report.owner.username],
				images: imageUrls,
				locale: "en_US",
				publishedTime: report.createdAt,
				modifiedTime: report.updatedAt,
				section: report.activityType.join(", "),
			},
			twitter: {
				card: "summary_large_image",
				title: report.title,
				description: report.description,
				images: imageUrls,
			},
			other: {
				"og:locale": "en_US",
				"og:site_name": "Trip Report",
				"geo.region": `${report.location.country}-${report.location.region}`,
				"geo.placename": report.location.localArea,
			},
		};
	} catch (error) {
		console.error("Error generating metadata:", error);
		return {
			title: "Error Loading Report",
			description: "An error occurred while loading the report metadata.",
		};
	}
}

const ReportPage: React.FC<ReportPageProps> = async ({ params }) => {
	try {
		const PUBLIC_DOMAIN = getBaseUrl();

		await connectDB();

		// Validate the ID
		if (!isValidObjectId(params.id)) {
			console.error(`Invalid report ID: ${params.id}`);
			return (
				<section className="min-h-screen flex flex-col bg-white py-40 -mb-[2px] dark:bg-black dark:bg-gradient-to-b dark:from-[#191919] dark:via-black dark:to-[#191919]">
					<div className="container mx-auto px-6">
						<h1 className="text-center text-2xl font-bold mt-1 dark:text-white">
							Invalid Report ID
						</h1>
					</div>
				</section>
			);
		}

		// Query the report in the DB and populate the owner field
		const reportDoc = await Report.findById(params.id).populate("owner").lean();

		// Null check
		if (!reportDoc) {
			return (
				<section className="min-h-screen flex flex-col bg-white py-40 -mb-[2px] dark:bg-black dark:bg-gradient-to-b dark:from-[#191919] dark:via-black dark:to-[#191919]">
					<div className="container mx-auto px-6">
						<h1 className="text-center text-2xl font-bold mt-1 dark:text-white">
							Report Not Found
						</h1>
					</div>
				</section>
			);
		}

		// Convert the document to a plain js object so we can pass to client components
		const report = convertToSerializableObject(reportDoc) as ReportType & {
			owner: UserType;
		};

		const author = {
			name: report.owner.username,
			id: report.owner.clerkId,
			mongoId: report.owner._id.toString(),
		};

		// Get the current user from the Clerk auth
		const { userId: clerkUserId } = auth();

		// Check if the current user is the author of the report
		const isAuthor = clerkUserId === report.owner.clerkId;

		const jsonLd = generateJsonLd(
			report,
			`${PUBLIC_DOMAIN}/reports/${params.id}`
		);

		return (
			<>
				<JsonLd data={jsonLd} />
				{report.images && report.images.length > 0 && (
					<ReportHeaderImage image={report.images[0]} />
				)}
				<section className="bg-white py-10 -mb-[2px] dark:bg-black dark:bg-gradient-to-b dark:from-[#191919] dark:via-black dark:to-black">
					<div className="container mx-auto px-6">
						<div className="grid grid-cols-1 gap-6">
							<ReportDetails
								report={report}
								author={author}
								isAuthor={isAuthor}
							/>
						</div>
					</div>
				</section>
				{report.caltopoUrl && (
					<section className="pb-10 dark:bg-black -mb-[2px]">
						<div className="container mx-auto max-w-6xl px-6">
							<div className="rounded-xl shadow-xl overflow-hidden bg-gray-100">
								<MapOverlay>
									<iframe
										src={report.caltopoUrl}
										width="100%"
										height="500"
										style={{ border: 0 }}
										allowFullScreen
										className="rounded-xl"
									></iframe>
								</MapOverlay>
							</div>
						</div>
					</section>
				)}
				<section className="pb-10 dark:bg-black -mb-[2px]">
					{report.images && report.images.length > 0 && (
						<ReportImages images={report.images} />
					)}
				</section>
				<section className="pb-10 -mb-[2px] dark:bg-black dark:text-white dark:bg-gradient-to-b dark:from-black dark:via-black dark:to-[#191919]">
					<ShareButtons report={report} PUBLIC_DOMAIN={PUBLIC_DOMAIN} />
				</section>
			</>
		);
	} catch (error) {
		console.error("Error in ReportPage:", error);
		return (
			<h1 className="text-center dark:text-white text-2xl font-bold mt-10">
				An error occurred. Please try again later.
			</h1>
		);
	}
};

export default ReportPage;
