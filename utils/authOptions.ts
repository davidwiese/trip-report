import connectDB from "@/config/database";
import User from "@/models/User";
import { Profile, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Create a custom type that extends the Profile type
interface GoogleProfile extends Profile {
	picture: string;
}

export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			authorization: {
				params: {
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
	],
	callbacks: {
		// Invoked on successful sign in
		async signIn({ profile }: { profile: GoogleProfile }) {
			// Connect to DB
			await connectDB();
			// Check if user exists
			const userExists = await User.findOne({ email: profile.email });
			// If not, add user to DB
			if (!userExists) {
				// Truncate user name if too long
				const username = profile.name?.slice(0, 20);

				await User.create({
					email: profile.email,
					username,
					image: profile.picture,
				});
			}
			// Return true to allow sign in
			return true;
		},

		// Modifies session object
		async session({ session }: { session: Session }) {
			// Get user from DB
			const user = await User.findOne({ email: session.user?.email });
			// Assign user id to session
			if (user && session.user) {
				(session.user as any).id = user._id.toString();
			}
			// Return session
			return session;
		},
	},
};
