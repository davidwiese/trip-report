import connectDB from "@/config/database";
import User from "@/models/User";
import { Profile, Session, Account, User as NextAuthUser } from "next-auth";
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
		async signIn({
			user,
			account,
			profile,
			email,
			credentials,
		}: {
			user: NextAuthUser;
			account: Account | null;
			profile?: Profile | undefined;
			email?: {
				verificationRequest?: boolean;
			};
			credentials?: Record<string, unknown>;
		}) {
			// Connect to DB
			await connectDB();
			const userEmail = (profile as GoogleProfile)?.email;
			// Check if user exists
			let userExists = await User.findOne({
				email: userEmail,
			});
			// If not, add user to DB
			if (!userExists) {
				// Truncate user name if too long
				const username = (profile as GoogleProfile)?.name?.slice(0, 20);

				userExists = await User.create({
					email: userEmail,
					username,
					bio: "",
					image: (profile as GoogleProfile)?.picture,
					totalReports: 0,
					totalDistance: 0,
					totalElevationGain: 0,
					totalElevationLoss: 0,
					reports: [],
					bookmarks: [],
					provider: account?.provider,
					providerId: account?.providerAccountId,
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
				(session.user as unknown as any).id = user._id.toString();
			}
			// Return session
			return session;
		},
	},
};
