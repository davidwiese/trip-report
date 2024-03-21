import GoogleProvider from "next-auth/providers/google";
import { Account, Profile, Session, User } from "next-auth";

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
		async signIn({
			user,
			account,
			profile,
			email,
			credentials,
		}: {
			user: User;
			account: Account | null;
			profile?: Profile;
			email?: {
				verificationRequest?: boolean;
			};
			credentials?: Record<string, unknown>;
		}) {
			// Connect to DB
			// Check if user exists
			// If not, add user to DB
			// Return true to allow sign in
			return true;
		},

		// Modifies session object
		async session({ session, user }: { session: Session; user: User }) {
			// Get user from DB
			// Assign user id to session
			// Return session
			return session;
		},
	},
};
