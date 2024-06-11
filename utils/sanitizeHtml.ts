import sanitizeHtml from "sanitize-html";

export function sanitizeHtmlContent(html: string): string {
	return sanitizeHtml(html, {
		allowedTags: [
			"p",
			"b",
			"strong",
			"i",
			"em",
			"s",
			"del",
			"h2",
			"ul",
			"ol",
			"li",
			"blockquote",
			"hr",
		],
		allowedAttributes: {
			"*": ["class"],
		},
		// Customize additional options as needed
	});
}
