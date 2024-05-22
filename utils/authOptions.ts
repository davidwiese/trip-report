import connectDB from "@/config/database";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import {
	Profile,
	Session,
	Account,
	User as NextAuthUser,
	NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Create a custom type that extends the Profile type
interface GoogleProfile extends Profile {
	picture: string;
}

export const authOptions: NextAuthOptions = {
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
		CredentialsProvider({
			name: "Sign-in with email and password",
			credentials: {
				email: { label: "Email", type: "email", placeholder: "your@email.com" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, req) {
				if (!credentials || !credentials.email || !credentials.password) {
					return null;
				}

				try {
					// Connect to the database
					await connectDB();

					// Find the user in the database
					let user = await User.findOne({ email: credentials.email });

					if (req.body?.isSignUp === "true") {
						// Handle sign-up process
						if (user) {
							throw new Error("User already exists");
						}
						const hashedPassword = await bcrypt.hash(credentials.password, 10);
						user = await User.create({
							email: credentials.email,
							username: credentials.email.split("@")[0], // Default username
							password: hashedPassword,
							provider: "credentials",
						});
					} else {
						// Handle sign-in process
						if (
							user &&
							(await bcrypt.compare(credentials.password, user.password))
						) {
							return user;
						} else {
							throw new Error("Invalid email or password");
						}
					}

					return user;
				} catch (error) {
					console.error("Error during email/password authentication:", error);
					throw new Error("Failed to authenticate user");
				}
			},
		}),
	],
	callbacks: {
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
			try {
				await connectDB();
				let userEmail: string | undefined;

				if (account?.provider === "google") {
					userEmail = (profile as GoogleProfile)?.email;
				} else if (credentials) {
					userEmail = credentials.email as string;
				}

				if (!userEmail) {
					return false;
				}

				let userExists = await User.findOne({ email: userEmail });

				if (!userExists && account?.provider === "google") {
					const username =
						(profile as GoogleProfile)?.name?.slice(0, 20) ||
						userEmail.split("@")[0];
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

				if (!userExists) {
					return false;
				}

				return true;
			} catch (error) {
				console.error("Error signing in:", error);
				return false;
			}
		},

		async session({ session }: { session: Session }) {
			try {
				const user = await User.findOne({ email: session.user?.email });
				if (user && session.user) {
					(session.user as unknown as any).id = user._id.toString();
				}
				return session;
			} catch (error) {
				console.error("Error retrieving user in session callback:", error);
				throw new Error("Failed to retrieve user session.");
			}
		},
	},
	pages: {
		signIn: "/auth/signin",
		error: "/auth/error", // Redirect to the custom error page
	},
};
