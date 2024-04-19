import MessageCard from "@/components/Message";
import connectDB from "@/config/database";
import Report from "@/models/Report";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";
import { Message as MessageType } from "@/types";
import { convertToSerializableObject } from "@/utils/convertToObject";

type MessagesPageProps = {
	// Add any props here if needed
};

const MessagePage: React.FC<MessagesPageProps> = async () => {
	await connectDB();

	const sessionUser = await getSessionUser();

	if (!sessionUser) {
		return (
			<section className="bg-blue-50">
				<div className="container m-auto py-24 max-w-6xl">
					<div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
						<h1 className="text-3xl font-bold mb-4">Your Messages</h1>
						<p>You are not logged in</p>
					</div>
				</div>
			</section>
		);
	}

	const { userId } = sessionUser;

	const readMessages = await Message.find({ recipient: userId, read: true })
		.sort({ createdAt: -1 }) // Sort read messages in asc order
		.populate("sender", "username")
		.populate("report", "name")
		.lean();

	const unreadMessages = await Message.find({
		recipient: userId,
		read: false,
	})
		.sort({ createdAt: -1 }) // Sort read messages in asc order
		.populate("sender", "username")
		.populate("report", "name")
		.lean();

	const messages = [...unreadMessages, ...readMessages].map((message) =>
		convertToSerializableObject(message)
	);

	return (
		<section className="bg-blue-50">
			<div className="container m-auto py-24 max-w-6xl">
				<div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
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
