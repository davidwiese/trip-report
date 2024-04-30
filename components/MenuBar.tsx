import { type Editor } from "@tiptap/react";
import { BoldIcon, Italic } from "lucide-react";

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
					editor.chain().focus().toggleBold().run();
				}}
				className={`flex gap-2 border-gray-50 border items-center justify-center rounded-lg px-2 py-1 ${
					editor.isActive("bold") ? "bg-black text-white" : ""
				}`}
			>
				<BoldIcon className="w-4 h-4" /> bold
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
				<Italic className="w-4 h-4" /> italic
			</button>
		</div>
	);
};

export default MenuBar;
