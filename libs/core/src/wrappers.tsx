import {
  cloneElement,
  Fragment,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useMemo,
} from 'react';

export interface ReactlitWrapperProps {
  position: number;
  stateKey: string;
}

export type ReactlitWrapperComponent = React.FC<
  PropsWithChildren<ReactlitWrapperProps>
>;

export type Wrapper = ReactlitWrapperComponent | React.ReactElement;

function applyWrapper(
  node: ReactElement,
  Wrap?: Wrapper,
  props?: ReactlitWrapperProps
): ReactElement {
  if (!Wrap) return node;
  if (isValidElement(Wrap)) return cloneElement(Wrap, {}, node);
  return Wrap({ children: node, ...props }) as ReactElement;
}
export function ApplyWrappers({
  wrappers,
  defaultWrapper,
  children,
  props,
}: {
  wrappers: (Wrapper | 'default')[];
  defaultWrapper: Wrapper;
  children: ReactNode;
  props: ReactlitWrapperProps;
}) {
  const wrappedContent = useMemo(() => {
    const base = wrappers.includes('default')
      ? [...wrappers]
      : [defaultWrapper, ...wrappers];
    return base.reverse().reduce(
      (acc, W) =>
        applyWrapper(acc, W === 'default' ? defaultWrapper : W, props),
      // this extra Fragment wrapper at the end is necessary for some
      // very mysterious reason to keep plain string nodes from shifting positions around
      <Fragment>{children}</Fragment>
    );
  }, [children, wrappers, defaultWrapper, props]);
  return wrappedContent;
}
