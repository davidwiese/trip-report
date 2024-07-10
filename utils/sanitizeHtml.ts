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

export function sanitizeText(input: string | null): string {
	if (!input) return "";
	return sanitizeHtml(input, {
		allowedTags: [],
		allowedAttributes: {},
	});
}

export function sanitizeDescription(input: string | null): string {
	if (!input) return "";
	return sanitizeHtml(input, {
		allowedTags: [],
		allowedAttributes: {},
		textFilter: function (text) {
			return text
				.replace(/&amp;/g, "&")
				.replace(/&lt;/g, "<")
				.replace(/&gt;/g, ">")
				.replace(/&#x2014;&#x2192;/g, "—>")
				.replace(/&#x2190;&#x2014;/g, "<—")
				.replace(/&#x2192;/g, "->")
				.replace(/&#x2190;/g, "<-");
		},
	});
}
