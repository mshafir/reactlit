import { ReactNode, useMemo } from 'react';

export type Wrapper = (props: { children: ReactNode }) => ReactNode;

export function applyWrapper(node: ReactNode, Wrap?: Wrapper) {
  return Wrap ? <Wrap>{node}</Wrap> : node;
}

export function combineWrappers(...wrappers: Wrapper[]): Wrapper {
  return ({ children }) =>
    wrappers.reduce((acc, Wrapper) => <Wrapper>{acc}</Wrapper>, children);
}

export function ApplyWrappers({
  wrappers,
  children,
}: {
  wrappers: Wrapper[];
  children: ReactNode;
}) {
  return useMemo(() => {
    console.log('apply wrappers', wrappers, children);
    return wrappers.reduce((acc, W) => applyWrapper(acc, W), children);
  }, [children, wrappers]);
}
