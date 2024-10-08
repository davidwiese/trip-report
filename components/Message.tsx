"use client";

import deleteMessage from "@/app/actions/deleteMessage";
import markMessageAsRead from "@/app/actions/markMessageAsRead";
import { useGlobalContext } from "@/context/GlobalContext";
import { Message as MessageType } from "@/types";
import { useState } from "react";
import { toast } from "react-toastify";

type MessageProps = {
	message: MessageType;
};

const MessageCard: React.FC<MessageProps> = ({ message }) => {
	const [isRead, setIsRead] = useState(message.read);
	const [isDeleted, setIsDeleted] = useState(false);

	const { setUnreadCount } = useGlobalContext();

	const handleReadClick = async () => {
		const read = await markMessageAsRead(message._id);
		setIsRead(read);
		setUnreadCount((prevCount) => (read ? prevCount - 1 : prevCount + 1));
		toast.success(`Marked as ${read ? "read" : "new"}`);
	};

	const handleDeleteClick = async () => {
		await deleteMessage(message._id);
		setIsDeleted(true);
		setUnreadCount((prevCount) => (isRead ? prevCount : prevCount - 1));
		toast.success("Message Deleted");
	};

	if (isDeleted) {
		return <p>Deleted message</p>;
	}

	return (
		<div className="relative bg-white p-4 rounded-md shadow-md border border-gray-200 dark:bg-black dark:text-white">
			{!isRead ? (
				<div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md">
					New
				</div>
			) : null}
			<p className="text-gray-700 dark:text-white">{message.body}</p>

			<ul className="mt-4 dark:bg-black dark:text-white">
				<li>
					<strong>Name:</strong> {message.sender.username}
				</li>
				<li>
					<strong>Email:</strong> {message.email}
				</li>

				<li>
					<strong>Received: </strong>
					{new Date(message.createdAt).toLocaleString()}
				</li>
			</ul>
			<button
				onClick={handleReadClick}
				className={`mt-4 mr-3 ${
					isRead
						? "bg-gray-300 dark:bg-white dark:text-black"
						: "bg-black text-white dark:bg-black dark:text-white dark:border"
				} py-1 px-3 rounded-md`}
			>
				{isRead ? "Mark As New" : "Mark As Read"}
			</button>
			<button
				onClick={handleDeleteClick}
				className="mt-4 bg-red-500 text-white py-1 px-3 rounded-md"
			>
				Delete
			</button>
		</div>
	);
};
export default MessageCard;
