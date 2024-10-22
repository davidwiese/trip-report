"use client";

import MenuBar from "@/components/MenuBar";
import { Extension } from "@tiptap/core";
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Plugin, PluginKey } from "prosemirror-state";
import { useEffect, useState } from "react";

const MaxLength = Extension.create({
	name: "maxLength",

	addOptions() {
		return {
			maxLength: 20000,
		};
	},

	addProseMirrorPlugins() {
		return [
			new Plugin({
				key: new PluginKey("maxLength"),
				filterTransaction: (transaction, state) => {
					const { maxLength } = this.options;
					const { doc } = transaction;
					const newDocLength = doc.textContent.length;

					if (newDocLength > maxLength) {
						return false;
					}

					return true;
				},
			}),
		];
	},
});

const ReportBodyEditor = ({
	initialValue,
	onChange,
}: {
	initialValue?: string;
	onChange: (content: string) => void;
}) => {
	const [charCount, setCharCount] = useState(0);

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
				paragraph: {
					HTMLAttributes: {
						class: "",
					},
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
			MaxLength.configure({
				maxLength: 20000,
			}),
			Placeholder.configure({
				placeholder: `Share your trip report here. Consider including:

• Weather and trail conditions
• Essential gear and recommendations
• Timing and navigation details
• Highlights and challenges
• Wildlife encounters
• Tips for future adventurers

The more details you provide, the more helpful your report will be. Use the formatting tools to organize your thoughts. Happy reporting!`,
				emptyEditorClass: "is-editor-empty",
			}),
		],
		editorProps: {
			attributes: {
				class:
					"report-body-editor min-h-[550px] md:min-h-[300px] focus:outline-none",
			},
		},
		content: initialValue,
		onUpdate({ editor }) {
			const html = editor.getHTML();
			onChange(html);
			setCharCount(editor.state.doc.textContent.length);
		},
	});

	useEffect(() => {
		if (
			editor &&
			initialValue !== undefined &&
			initialValue !== editor.getHTML()
		) {
			editor.commands.setContent(initialValue);
			setCharCount(editor.state.doc.textContent.length);
		}
	}, [editor, initialValue]);

	if (!editor) {
		return null;
	}

	return (
		<div className="relative rounded dark:bg-black">
			<div className="sticky top-0 bg-white z-10 pb-2">
				<MenuBar editor={editor} />
			</div>
			<div className="border p-4">
				<EditorContent
					editor={editor}
					className="dark:bg-black dark:text-white"
				/>
				<div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
					{charCount}/20000 characters
				</div>
			</div>
		</div>
	);
};

export default ReportBodyEditor;
