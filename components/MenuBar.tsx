import { type Editor } from "@tiptap/react";
import {
	Pilcrow,
	BoldIcon,
	Italic,
	Strikethrough,
	Heading2,
	List,
	ListOrdered,
	Quote,
	Minus,
	Undo,
	Redo,
} from "lucide-react";

type Props = {
	editor: Editor | null;
};

const MenuBar = ({ editor }: Props) => {
	if (!editor) {
		return null;
	}

	return (
		<div className="flex flex-wrap gap-2 mb-4">
			<button
				onClick={(e) => {
					e.preventDefault();
					editor.chain().focus().setParagraph().run();
				}}
				className={`flex gap-2 border-gray-50 border items-center justify-center rounded-lg px-2 py-1 ${
					editor.isActive("paragraph") ? "bg-black text-white" : ""
				}`}
			>
				<Pilcrow className="w-4 h-4" />
			</button>
			<button
				onClick={(e) => {
					e.preventDefault();
					editor.chain().focus().toggleBold().run();
				}}
				className={`flex gap-2 border-gray-50 border items-center justify-center rounded-lg px-2 py-1 ${
					editor.isActive("bold") ? "bg-black text-white" : ""
				}`}
			>
				<BoldIcon className="w-4 h-4" />
			</button>
			<button
				onClick={(e) => {
					e.preventDefault();
					editor.chain().focus().toggleItalic().run();
				}}
				className={`flex gap-2 border-gray-50 border items-center justify-center rounded-lg px-2 py-1 ${
					editor.isActive("italic") ? "bg-black text-white" : ""
				}`}
			>
				<Italic className="w-4 h-4" />
			</button>
			<button
				onClick={(e) => {
					e.preventDefault();
					editor.chain().focus().toggleStrike().run();
				}}
				className={`flex gap-2 border-gray-50 border items-center justify-center rounded-lg px-2 py-1 ${
					editor.isActive("strike") ? "bg-black text-white" : ""
				}`}
			>
				<Strikethrough className="w-4 h-4" />
			</button>
			<button
				onClick={(e) => {
					e.preventDefault();
					editor.chain().focus().toggleHeading({ level: 2 }).run();
				}}
				className={`flex gap-2 border-gray-50 border items-center justify-center rounded-lg px-2 py-1 ${
					editor.isActive("heading", { level: 2 }) ? "bg-black text-white" : ""
				}`}
			>
				<Heading2 className="w-4 h-4" />
			</button>
		</div>
	);
};

export default MenuBar;
