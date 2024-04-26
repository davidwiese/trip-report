"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const ReportBodyEditor = () => {
	const editor = useEditor({
		extensions: [StarterKit],
		content:
			"<p>Type your report here and format with the menu bar above...</p>",
	});

	return <EditorContent editor={editor} />;
};

export default ReportBodyEditor;
