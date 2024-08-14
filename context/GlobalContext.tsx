"use client";

import getUnreadMessageCount from "@/app/actions/getUnreadMessageCount";
import { useUser } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react";

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
	const { isSignedIn, user } = useUser();

	// NOTE: since our GlobalContext is responsible for unreadCount state then it
	// makes sense to also fetch the unreadCount here too and remove that from the
	// UnreadMessageCount component.
	// Additionally here we are using a server action to get the unreadCount

	useEffect(() => {
		if (isSignedIn && user) {
			getUnreadMessageCount().then((res) => {
				if (res.count) setUnreadCount(res.count);
			});
		}
	}, [isSignedIn, user]);

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
