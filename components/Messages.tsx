import MessageCard from "@/components/Message";
import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

type MessagesProps = {
	// Add any props if needed
};

const Messages: React.FC<MessagesProps> = async () => {
	await connectDB();

	const sessionUser = await getSessionUser();

	if (!sessionUser || !sessionUser.userId) {
		// Handle case when session user or userId is not available
		return <div>Loading...</div>;
	}

	const { userId } = sessionUser;

	const readMessages = await Message.find({ recipient: userId, read: true })
		.sort({ createdAt: -1 })
		.populate("sender", "username")
		.populate("report", "name")
		.lean();

	const unreadMessages = await Message.find({
		recipient: userId,
		read: false,
	})
		.sort({ createdAt: -1 })
		.populate("sender", "username")
		.populate("report", "name")
		.lean();

	const messages = [...unreadMessages, ...readMessages].map((message: any) => ({
		...message,
		_id: message._id.toString(),
		report: {
			...message.report,
			_id: message.report._id.toString(),
		},
	}));

	// TODO: Fallback to loader

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
								<MessageCard key={message._id} message={message} />
							))
						)}
					</div>
				</div>
			</div>
		</section>
	);
};
export default Messages;
