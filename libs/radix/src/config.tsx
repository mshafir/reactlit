import { Theme, ThemeProps } from '@radix-ui/themes';
import { Wrapper } from '@reactlit/core';
import { ReactNode } from 'react';
import { DefaultWrapper } from './default-wrapper';

export interface RadixConfig {
  theme?: ThemeProps;
  wrapper?: Wrapper;
}

export interface BaseProps {
  wrapper?: Wrapper;
}

export function getBaseProps(config: RadixConfig): BaseProps {
  return {
    wrapper: (children: ReactNode) => (
      <Theme data-is-root-theme={false} {...config?.theme}>
        {config?.wrapper?.(children) ?? DefaultWrapper(children)}
      </Theme>
    ),
  };
}
