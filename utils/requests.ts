const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

async function fetchReports() {
	try {
		// Handle case where domain is not available yet, such as on build/deploy
		if (!apiDomain) {
			return [];
		}

		const res = await fetch(`${apiDomain}/reports`, {
			cache: "no-store",
		});

		if (!res.ok) {
			throw new Error("Failed to fetch data");
		}
		return res.json();
	} catch (error) {
		console.log(error);
		return [];
	}
}

export { fetchReports };
