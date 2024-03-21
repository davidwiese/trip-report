"use client";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

type AuthProviderProps = {
	children: ReactNode;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	return <SessionProvider>{children}</SessionProvider>;
};
export default AuthProvider;
