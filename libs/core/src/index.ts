export * from './reactlit';
export * from './builtins/types';
export { defineView, defineTransformView } from './builtins/view';
export * from './hooks/use-reactlit';
export * from './hooks/use-reactlit-state';
export * from './utils/apply-wrapper';
export * from './inputs/form.view';
export * from './inputs/layout.view';
export * from './plugins/data-fetching';

// see https://github.com/mdx-js/mdx/issues/2487
import type { JSX as Jsx } from 'react/jsx-runtime';

declare global {
  namespace JSX {
    type ElementClass = Jsx.ElementClass;
    type Element = Jsx.Element;
    type IntrinsicElements = Jsx.IntrinsicElements;
  }
}
