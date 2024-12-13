import { Box, Flex, Link } from '@radix-ui/themes';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

function MenuItem({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Box pb="1">
      <Link asChild color={isActive ? 'blue' : 'gray'}>
        <NextLink href={href}>{children}</NextLink>
      </Link>
    </Box>
  );
}

export function Menu() {
  return (
    <Flex direction={'column'} p="4">
      <MenuItem href="/hello-world">Hello World</MenuItem>
      <MenuItem href="/hello-world-vanilla">Hello World Vanilla</MenuItem>
      <MenuItem href="/radix-inputs">Radix Inputs</MenuItem>
      <MenuItem href="/todo-list">Todo List</MenuItem>
      <MenuItem href="/starter">Starter</MenuItem>
    </Flex>
  );
}
