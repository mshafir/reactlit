import { Fragment, ReactElement } from 'react';

export function repeatElement(
  it: ReactElement | ((index: number) => ReactElement),
  num: number
): ReactElement[] {
  const result = [] as ReactElement[];
  for (let i = 0; i < num; i++) {
    result.push(
      <Fragment key={i}>{typeof it === 'function' ? it(i) : it}</Fragment>
    );
  }
  return result;
}
