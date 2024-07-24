"use client";

import getUnreadMessageCount from "@/app/actions/getUnreadMessageCount";
import { useSession } from "next-auth/react";
import { createContext, useContext, useState, useEffect } from "react";

interface ContextType {
	unreadCount: number;
	setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}

// Create context
const GlobalContext = createContext<ContextType>({
	unreadCount: 0,
	setUnreadCount: () => {},
});

// Create a provider
export function GlobalProvider({ children }: { children: React.ReactNode }) {
	const [unreadCount, setUnreadCount] = useState(0);

	const { data: session } = useSession();

	// NOTE: since our GlobalContext is responsible for unreadCount state then it
	// makes sense to also fetch the unreadCount here too and remove that from the
	// UnreadMessageCount component.
	// Additionally here we are using a server action to get the unreadCount

	useEffect(() => {
		if (session && session.user) {
			getUnreadMessageCount().then((res) => {
				if (res.count) setUnreadCount(res.count);
			});
		}
	}, [session]);

	return (
		<GlobalContext.Provider
			value={{
				unreadCount,
				setUnreadCount,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
}

// Create a custom hook to access context
export function useGlobalContext() {
	return useContext(GlobalContext);
}
