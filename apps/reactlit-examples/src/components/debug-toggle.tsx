"use client";
import { Button, Tooltip } from "@radix-ui/themes";
import { Wrapper } from "@reactlit/core";
import { Bug, BugOff } from "lucide-react";
import { createContext, useContext, useState } from "react";

type DebugContextType = {
	debug: boolean;
	setDebug: (debug: boolean) => void;
};

const DebugContext = createContext<DebugContextType>({
	debug: false,
	setDebug: () => {},
});

export const DebugToggle = () => {
	const { debug, setDebug } = useContext(DebugContext);
	return (
		<Tooltip content="Toggle debug">
			<Button size="1" variant="ghost" onClick={() => setDebug(!debug)}>
				{debug ? <BugOff /> : <Bug />}
			</Button>
		</Tooltip>
	);
};

export const DebugProvider = ({ children }: { children: React.ReactNode }) => {
	const [debug, setDebug] = useState(false);
	return (
		<DebugContext.Provider value={{ debug, setDebug }}>
			{children}
		</DebugContext.Provider>
	);
};

export function useDebug() {
	const { debug } = useContext(DebugContext);
	return debug;
}

export const Debug: Wrapper = ({ children, stateKey }) => {
	const debug = useDebug();
	if (!debug) return children;
	return (
		<div className="grid grid-cols-[auto_1fr] gap-2 items-center border rounded-md mb-2 overflow-hidden">
			<div className="min-w-16 p-2 h-full border-r text-xs">{stateKey}</div>
			<div className="flex-auto p-2">{children}</div>
		</div>
	);
};
