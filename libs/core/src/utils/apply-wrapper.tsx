export type Wrapper = (props: { children: React.ReactNode }) => React.ReactNode;

export function applyWrapper(node: React.ReactNode, Wrapper?: Wrapper) {
  return Wrapper ? <Wrapper>{node}</Wrapper> : node;
}

export function combineWrappers(...wrappers: Wrapper[]): Wrapper {
  return ({ children }) =>
    wrappers.reduce((acc, Wrapper) => <Wrapper>{acc}</Wrapper>, children);
}
