import { Box, Container, Flex, Theme, ThemeProps } from '@radix-ui/themes';
import { Wrapper } from '@reactlit/core';
import { PropsWithChildren } from 'react';

export const BoxContainerWrapper: Wrapper = ({ children }) => (
  <Box py="2">
    <Container size="2" align={'left'}>
      <Flex direction="column" gap="1">
        {children}
      </Flex>
    </Container>
  </Box>
);

export const RadixTheme = ({
  children,
  ...props
}: PropsWithChildren<ThemeProps>) => {
  return (
    <Theme data-is-root-theme={false} {...props}>
      {children}
    </Theme>
  );
};

export const RadixThemeWrapper = (theme?: ThemeProps) => {
  const RadixThemeWrapper: Wrapper = ({ children }) => (
    <RadixTheme {...theme}>{children}</RadixTheme>
  );
  return RadixThemeWrapper;
};

export const RadixWrapper = (theme?: ThemeProps) => {
  const ThemeWrapper = RadixThemeWrapper(theme);
  const RadixWrapper: Wrapper = ({ children, ...props }) => (
    <ThemeWrapper {...props}>
      <BoxContainerWrapper {...props}>{children}</BoxContainerWrapper>
    </ThemeWrapper>
  );
  return RadixWrapper;
};

export const DefaultRadixWrapper = RadixWrapper();
