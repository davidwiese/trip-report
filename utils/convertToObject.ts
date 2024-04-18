/**
 * Converts a Mongoose lean document into a serializable plain JavaScript object.
 *
 * @param {Object} leanDocument - The Mongoose lean document to be converted.
 * @returns {Object} A plain JavaScript object that is a serializable representation of the input document.
 */

export function convertToSerializableObject(
	leanDocument: Record<string, any>
): Record<string, any> {
	if (Array.isArray(leanDocument)) {
		return leanDocument.map((item) => convertToSerializableObject(item));
	} else if (leanDocument !== null && typeof leanDocument === "object") {
		const convertedDocument: Record<string, any> = {};
		for (const key in leanDocument) {
			if (leanDocument.hasOwnProperty(key)) {
				const value = leanDocument[key];
				if (
					value &&
					typeof value === "object" &&
					typeof value.toJSON === "function"
				) {
					convertedDocument[key] = value.toString();
				} else {
					convertedDocument[key] = convertToSerializableObject(value);
				}
			}
		}
		return convertedDocument;
	}
	return leanDocument;
}
