"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "@/components/MenuBar";
import Heading from "@tiptap/extension-heading";

const ReportBodyEditor = ({
	onChange,
	content,
}: {
	content: string;
	onChange: any;
}) => {
	const handleChange = (value: string) => {
		onChange(value);
	};

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				code: false,
				codeBlock: false,
			}),
			Heading.configure({
				HTMLAttributes: {
					class: "text-3xl font-bold mb-4",
				},
				levels: [2],
			}),
		],
	});

	if (!editor) {
		return null;
	}

	return (
		<div className="rounded p-4">
			<input type="hidden" name="body" value={editor?.getHTML() || ""} />
			<MenuBar editor={editor} />
			<EditorContent editor={editor} />
		</div>
	);
};

export default ReportBodyEditor;
