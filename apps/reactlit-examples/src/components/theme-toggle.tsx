'use client';
import { Button, Tooltip } from '@radix-ui/themes';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Tooltip content="Toggle theme">
      <Button
        size="1"
        variant="ghost"
        onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
      >
        {resolvedTheme === 'dark' ? <MoonIcon /> : <SunIcon />}
      </Button>
    </Tooltip>
  );
}
