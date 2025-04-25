"use client";
import { Button, Tooltip } from "@radix-ui/themes";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<Tooltip content="Toggle theme">
			<Button
				size="1"
				variant="ghost"
				onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
			>
				{resolvedTheme === "dark" ? <MoonIcon /> : <SunIcon />}
			</Button>
		</Tooltip>
	);
}
