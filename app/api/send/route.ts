import { EmailTemplate } from "@/components/EmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
	try {
		const { name, email, message } = await request.json();
		const { data, error } = await resend.emails.send({
			from: "Trip Report <noreply@tripreport.co>",
			to: ["admin@tripreport.co"],
			subject: `New Contact Form Submission from ${name}`,
			react: EmailTemplate({ name, email, message }),
			text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
		});

		if (error) {
			return Response.json({ error }, { status: 500 });
		}

		return Response.json(
			{ message: "Email sent successfully" },
			{ status: 200 }
		);
	} catch (error) {
		return Response.json({ error: "Failed to send email" }, { status: 500 });
	}
}
