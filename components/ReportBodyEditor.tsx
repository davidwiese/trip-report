"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "@/components/MenuBar";

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
		extensions: [StarterKit],
		content,
		onUpdate: ({ editor }) => {
			handleChange(editor.getHTML());
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
