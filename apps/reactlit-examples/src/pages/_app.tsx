import "@/styles/globals.css";
import "@radix-ui/themes/styles.css";
import { DebugProvider } from "@/components/debug-toggle";
import { Main } from "@/components/main";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider attribute="class">
			<Theme>
				<DebugProvider>
					<Main title="Reactlit Examples">
						<Component {...pageProps} />
					</Main>
				</DebugProvider>
			</Theme>
		</ThemeProvider>
	);
}
