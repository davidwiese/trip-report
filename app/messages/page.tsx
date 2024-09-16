import MessageCard from "@/components/Message";
import connectDB from "@/config/database";
import Message from "@/models/Message";
import { Message as MessageType } from "@/types";
import { convertToSerializableObject } from "@/utils/convertToObject";
import { findUserByClerkId } from "@/utils/userUtils";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

type MessagesPageProps = {};

export const metadata: Metadata = {
	title: "Messages",
	description: "View and manage your messages on Trip Report.",
	robots: { index: false, follow: false }, // Since this is a private page
};

const MessagePage: React.FC<MessagesPageProps> = async () => {
	await connectDB();

	const { userId: clerkUserId } = auth();

	if (!clerkUserId) {
		return (
			<section className="bg-white min-h-screen flex dark:bg-black dark:bg-gradient-to-b dark:from-black dark:via-black dark:to-[#191919]">
				<div className="container mx-auto py-24 max-w-6xl">
					<div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
						<h1 className="text-3xl font-bold mb-4">Your Messages</h1>
						<p>You are not logged in</p>
					</div>
				</div>
			</section>
		);
	}

	// Find the user in your database using the Clerk userId
	const user = await findUserByClerkId(clerkUserId);

	if (!user) {
		console.error(`No user found for Clerk ID: ${clerkUserId}`);
		return (
			<section className="bg-white min-h-screen flex dark:bg-black dark:bg-gradient-to-b dark:from-black dark:via-black dark:to-[#191919]">
				<div className="container mx-auto py-24 max-w-6xl">
					<div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
						<h1 className="text-3xl font-bold mb-4">Your Messages</h1>
						<p>User not found</p>
					</div>
				</div>
			</section>
		);
	}

	const readMessages = await Message.find({ recipient: user._id, read: true })
		.sort({ createdAt: -1 })
		.populate("sender", "username")
		.lean();

	const unreadMessages = await Message.find({
		recipient: user._id,
		read: false,
	})
		.sort({ createdAt: -1 })
		.populate("sender", "username")
		.lean();

	const messages = [...unreadMessages, ...readMessages].map((message) =>
		convertToSerializableObject(message)
	);

	return (
		<section className="bg-white min-h-screen flex flex-col dark:bg-black dark:bg-gradient-to-b dark:from-black dark:via-black dark:to-[#191919]">
			<div className="container mx-auto py-24 max-w-6xl">
				<div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0 dark:bg-black dark:text-white">
					<h1 className="text-3xl font-bold mb-4">Your Messages</h1>

					<div className="space-y-4">
						{messages.length === 0 ? (
							<p>You have no messages</p>
						) : (
							messages.map((message) => (
								<MessageCard
									key={message._id as string}
									message={message as MessageType}
								/>
							))
						)}
					</div>
				</div>
			</div>
		</section>
	);
};
export default MessagePage;
