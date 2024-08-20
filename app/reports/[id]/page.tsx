import ReportDetails from "@/components/ReportDetails";
import ReportHeaderImage from "@/components/ReportHeaderImage";
import ReportImages from "@/components/ReportImages";
import ShareButtons from "@/components/ShareButtons";
import connectDB from "@/config/database";
import Report from "@/models/Report";
import { Report as ReportType, User as UserType } from "@/types";
import { convertToSerializableObject } from "@/utils/convertToObject";
import { auth } from "@clerk/nextjs/server";
import { Metadata, ResolvingMetadata } from "next";
import Script from "next/script";

type ReportPageProps = {
	params: {
		id: string;
	};
};

function generateJsonLd(report: ReportType, fullUrl: string) {
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
			name: report.owner,
		},
		publisher: {
			"@type": "Organization",
			name: "Trip Report",
			logo: {
				"@type": "ImageObject",
				url: "https://www.tripreport.co/images/logo_fill.png",
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
	// Fetch the report data
	const report = (await Report.findById(params.id).lean()) as ReportType | null;

	if (!report) {
		return {
			title: "Report Not Found",
		};
	}

	const imageUrls = report.images?.map((img: { url: string }) => img.url) || [];

	const keywords = [
		report.title,
		...report.activityType,
		report.location.country,
		report.location.region,
		report.location.localArea,
		report.location.objective,
		"trip report",
		"trip reports",
	].filter(Boolean);

	// Determine the base URL based on the environment
	const baseUrl =
		process.env.NODE_ENV === "production"
			? `https://${process.env.VERCEL_URL}`
			: "http://localhost:3000";

	// Construct the full URL for this report
	const fullUrl = `${baseUrl}/reports/${params.id}`;

	const jsonLd = generateJsonLd(report, fullUrl);

	return {
		title: `${report.title} | Trip Report`,
		description: report.description,
		keywords: keywords,
		openGraph: {
			title: report.title,
			description: report.description,
			type: "article",
			url: fullUrl,
			siteName: "Trip Report",
			authors: report.owner,
			images: imageUrls,
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
			"geo.region": `${report.location.country}-${report.location.region}`,
			"geo.placename": report.location.localArea,
			"json-ld": JSON.stringify(jsonLd),
		},
	};
}

const ReportPage: React.FC<ReportPageProps> = async ({ params }) => {
	try {
		const PUBLIC_DOMAIN =
			process.env.NODE_ENV === "production"
				? `https://${process.env.VERCEL_URL}`
				: "http://localhost:3000";

		await connectDB();

		// Query the report in the DB and populate the owner field
		const reportDoc = await Report.findById(params.id).populate("owner").lean();

		// Null check
		if (!reportDoc) {
			return (
				<h1 className="text-center text-2xl font-bold mt-10">
					Report Not Found
				</h1>
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
				<section className="bg-white py-10">
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
					<section className="mb-10">
						<div className="container mx-auto max-w-6xl px-6">
							<div className="rounded-xl shadow-xl overflow-hidden bg-gray-100">
								<iframe
									src={report.caltopoUrl}
									width="100%"
									height="500"
									style={{ border: 0 }}
									allowFullScreen
									className="rounded-xl"
								></iframe>
							</div>
						</div>
					</section>
				)}
				<section className="mb-10">
					{report.images && report.images.length > 0 && (
						<ReportImages images={report.images} />
					)}
				</section>
				<section className="mb-10">
					<ShareButtons report={report} PUBLIC_DOMAIN={PUBLIC_DOMAIN} />
				</section>
			</>
		);
	} catch (error) {
		console.error("Error in ReportPage:", error);
		return (
			<h1 className="text-center text-2xl font-bold mt-10">
				An error occurred. Please try again later.
			</h1>
		);
	}
};

export default ReportPage;
