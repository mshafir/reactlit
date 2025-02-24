import { Box, Container, Flex, Text } from '@radix-ui/themes';
import { Geist, Geist_Mono } from 'next/font/google';
import Head from 'next/head';
import React from 'react';
import { DebugToggle } from './debug-toggle';
import { Menu } from './menu';
import { ThemeToggle } from './theme-toggle';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export function Main({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)]`}
    >
      <main>
        <Head>
          <title>{title}</title>
        </Head>
        <Box style={{ background: 'var(--gray-2)' }}>
          <Flex direction="column" height="100vh">
            <Flex
              width="100%"
              p="4"
              align="center"
              gap="4"
              style={{
                background: 'var(--color-background)',
                borderBottom: '1px solid var(--gray-4)',
              }}
            >
              <Text size="3" weight={'bold'}>
                {title}
              </Text>
              <Box flexGrow={'1'} />
              <DebugToggle />
              <ThemeToggle />
            </Flex>
            <Flex flexGrow={'1'} overflow={'hidden'}>
              <Flex direction={'column'} overflow={'auto'}>
                <Menu />
              </Flex>
              <Flex flexGrow={'1'} direction={'column'} overflow={'auto'}>
                <Container size="4" flexGrow={'1'} height={'100%'}>
                  <Box
                    p="4"
                    style={{
                      background: 'var(--color-background)',
                      boxShadow: 'var(--shadow-3)',
                      minHeight: '30rem',
                      overflow: 'hidden',
                    }}
                  >
                    {children}
                  </Box>
                </Container>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </main>
    </div>
  );
}
