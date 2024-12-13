export * from './hooks/use-reactlit-state';
export * from './reactlit';
export * from './utils/with-wrapper';
export * from './inputs/form.input';
export * from './plugins/data-fetching';
export * from './plugins/layout';

// see https://github.com/mdx-js/mdx/issues/2487
import type { JSX as Jsx } from 'react/jsx-runtime';

declare global {
  namespace JSX {
    type ElementClass = Jsx.ElementClass;
    type Element = Jsx.Element;
    type IntrinsicElements = Jsx.IntrinsicElements;
  }
}
