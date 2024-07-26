import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import connectDB from "@/config/database";
import User from "@/models/User";

export async function POST(req: Request) {
	const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

	if (!WEBHOOK_SECRET) {
		throw new Error(
			"Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
		);
	}

	// Get the headers
	const headerPayload = headers();
	const svix_id = headerPayload.get("svix-id");
	const svix_timestamp = headerPayload.get("svix-timestamp");
	const svix_signature = headerPayload.get("svix-signature");

	// If there are no headers, error out
	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response("Error occurred -- no svix headers", {
			status: 400,
		});
	}

	// Get the body
	const payload = await req.json();
	const body = JSON.stringify(payload);

	// Create a new Svix instance with your secret.
	const wh = new Webhook(WEBHOOK_SECRET);

	let evt: WebhookEvent;

	// Verify the payload with the headers
	try {
		evt = wh.verify(body, {
			"svix-id": svix_id,
			"svix-timestamp": svix_timestamp,
			"svix-signature": svix_signature,
		}) as WebhookEvent;
	} catch (err) {
		console.error("Error verifying webhook:", err);
		return new Response("Error occurred", {
			status: 400,
		});
	}

	// Handle the webhook
	const eventType = evt.type;

	if (eventType === "user.created" || eventType === "user.updated") {
		const { id, email_addresses, username, image_url } = evt.data;

		const userEmail = email_addresses[0]?.email_address;

		if (!userEmail) {
			return new Response("No email found", { status: 400 });
		}

		await connectDB();

		const userData = {
			clerkId: id,
			email: userEmail,
			username: username || userEmail.split("@")[0],
			image: image_url,
		};

		await User.findOneAndUpdate({ clerkId: id }, userData, {
			upsert: true,
			new: true,
		});

		return new Response("User created or updated", { status: 200 });
	}

	return new Response("Webhook received", { status: 200 });
}
