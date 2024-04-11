"use client";
import { createContext, useContext, useState } from "react";

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

	return (
		<GlobalContext.Provider value={{ unreadCount, setUnreadCount }}>
			{children}
		</GlobalContext.Provider>
	);
}

// Create a custom hook to access context
export function useGlobalContext() {
	const context = useContext(GlobalContext);
	if (!context) {
		throw new Error("useGlobalContext must be used within a GlobalProvider");
	}
	return context;
}
