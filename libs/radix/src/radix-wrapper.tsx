import { Box, Container, Flex, Theme, ThemeProps } from '@radix-ui/themes';
import { combineWrappers, Wrapper } from '@reactlit/core';

export const BoxContainerWrapper: Wrapper = ({ children }) => (
  <Box py="2">
    <Container size="2" align={'left'}>
      <Flex direction="column" gap="1">
        {children}
      </Flex>
    </Container>
  </Box>
);

export const RadixThemeWrapper = (theme?: ThemeProps) => {
  const RadixThemeWrapper: Wrapper = ({ children }) => (
    <Theme data-is-root-theme={false} {...theme}>
      {children}
    </Theme>
  );
  return RadixThemeWrapper;
};

export const RadixWrapper = (theme?: ThemeProps) => {
  return combineWrappers(RadixThemeWrapper(theme), BoxContainerWrapper);
};
