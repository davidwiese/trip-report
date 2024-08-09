export async function POST(req: Request) {
	console.log("Webhook received");

	// Get the body
	const payload = await req.json();
	console.log("Webhook payload:", payload);

	return new Response("Received", { status: 200 });
}
