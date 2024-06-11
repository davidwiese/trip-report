"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "@/components/MenuBar";
import Heading from "@tiptap/extension-heading";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";

const ReportBodyEditor = ({
	value,
	onChange,
}: {
	value?: string;
	onChange: (content: string) => void;
}) => {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				code: false,
				codeBlock: false,
				heading: false,
				blockquote: false,
				horizontalRule: false,
				bulletList: false,
				orderedList: false,
				listItem: false,
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
			BulletList.configure({
				HTMLAttributes: {
					class: "list-disc ml-6",
				},
			}),
			OrderedList.configure({
				HTMLAttributes: {
					class: "list-decimal ml-5",
				},
			}),
			ListItem.configure({
				HTMLAttributes: {
					class: "pl-2",
				},
			}),
		],
		content:
			value ||
			`<h2>Type your Trip Report here...</h2><p>Format it with the menu bar above.</p>`,
		onUpdate({ editor }) {
			onChange(editor.getHTML());
		},
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
