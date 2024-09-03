export function getBaseUrl() {
	// Production environment (on Vercel)
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}

	// Development environment
	if (process.env.NODE_ENV === "development") {
		return "http://localhost:3000";
	}

	// Fallback (should never reach here in normal circumstances)
	return "https://www.tripreport.co";
}
