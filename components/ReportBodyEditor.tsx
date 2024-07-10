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
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { useState, useEffect } from "react";

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
	value,
	onChange,
}: {
	value?: string;
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
		],
		content:
			value ||
			`<h2>Your Trip Report</h2><p>Share your experience to help fellow adventurers! Here are some key points to consider:</p><p></p><ul><li><strong>Weather Conditions:</strong> Describe the weather you encountered. Was it as forecasted?</li><li><strong>Trail Conditions:</strong> How was the trail? Any challenging sections or recent changes?</li><li><strong>Gear:</strong> What gear was essential? Anything you wish you had brought or left behind?</li><li><strong>Timing:</strong> How long did different sections take? Any recommendations on start times?</li><li><strong>Navigation:</strong> Were there any tricky navigation points? How well-marked was the route?</li><li><strong>Highlights:</strong> What were the best parts of your trip? Any unexpected discoveries?</li><li><strong>Challenges:</strong> What difficulties did you face? How did you overcome them?</li><li><strong>Wildlife & Nature:</strong> Did you encounter any wildlife or notable natural features?</li><li><strong>Tips for Others:</strong> What advice would you give to someone planning this trip?</li></ul><p></p><p>Remember, your insights are valuable! The more detail you provide, the more helpful your report will be. Use the formatting tools above to organize your thoughts and make your report beautiful.</p><p></p><p>Happy reporting, and thanks for sharing your adventure!</p>`,
		onUpdate({ editor }) {
			onChange(editor.getHTML());
			setCharCount(editor.state.doc.textContent.length);
		},
	});

	useEffect(() => {
		if (editor) {
			setCharCount(editor.state.doc.textContent.length);
		}
	}, [editor]);

	if (!editor) {
		return null;
	}

	return (
		<div className="rounded p-4">
			<input type="hidden" name="body" value={editor.getHTML()} />
			<MenuBar editor={editor} />
			<EditorContent editor={editor} />
			<div className="text-sm text-gray-500 mt-2">
				{charCount}/20000 characters
			</div>
		</div>
	);
};

export default ReportBodyEditor;
