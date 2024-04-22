"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "@/components/MenuBar";
import Heading from "@tiptap/extension-heading";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

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
				bulletList: {
					HTMLAttributes: {
						class: "",
					},
					keepMarks: true,
					keepAttributes: false,
				},
				orderedList: {
					HTMLAttributes: {
						class: "",
					},
					keepMarks: true,
					keepAttributes: false,
				},
			}),
			Heading.configure({
				HTMLAttributes: {
					class: "text-3xl font-bold mb-4",
				},
				levels: [2],
			}),
			Blockquote.configure({
				HTMLAttributes: {
					class: "border-l-4 border-gray-200 pl-4",
				},
			}),
			HorizontalRule.configure({
				HTMLAttributes: {
					class: "border-t border-gray-200 my-4",
				},
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
