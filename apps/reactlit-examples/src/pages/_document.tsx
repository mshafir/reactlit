import { Theme } from '@radix-ui/themes';
import { Html, Head, Main, NextScript } from 'next/document';
import { ThemeProvider } from 'next-themes';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <ThemeProvider attribute="class">
          <Theme>
            <Main />
            <NextScript />
          </Theme>
        </ThemeProvider>
      </body>
    </Html>
  );
}
