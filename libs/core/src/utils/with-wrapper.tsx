export type Wrapper = (children: React.ReactNode) => React.ReactNode;

export function withWrapper<T>(Component: React.ComponentType<T>) {
  return ({ wrapper, ...props }: T & { wrapper?: Wrapper }) => {
    const NoWrapperComponent = Component as React.ComponentType<
      Omit<T, 'wrapper'>
    >;
    const result = <NoWrapperComponent {...props} />;
    return applyWrapper(result, wrapper);
  };
}

export function applyWrapper(node: React.ReactNode, wrapper?: Wrapper) {
  return wrapper ? wrapper(node) : node;
}
