const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

// Fetch single report
async function fetchReport(id: string | string[]) {
	try {
		// Handle case where domain is not available yet, such as on build/deploy
		if (!apiDomain) {
			return null;
		}

		const res = await fetch(`${apiDomain}/reports/${id}`, {
			cache: "no-store",
		});

		if (!res.ok) {
			throw new Error("Failed to fetch data");
		}
		return res.json();
	} catch (error) {
		console.log(error);
		return null;
	}
}

export { fetchReport };
