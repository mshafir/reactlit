import { Box, Container, Flex } from '@radix-ui/themes';
import { ReactNode } from 'react';

export const DefaultWrapper = (children: ReactNode) => (
  <Box py="2">
    <Container size="2" align={'left'}>
      <Flex direction="column" gap="1">
        {children}
      </Flex>
    </Container>
  </Box>
);
