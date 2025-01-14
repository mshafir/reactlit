import { useCallback } from 'react';
import {
  ReactlitContext,
  StateBase,
  ViewComponent,
  ViewComponentProps,
  ViewDefinition,
} from './types';
import { Wrapper } from '../utils/apply-wrapper';
import { tail } from '../utils/tail';

export function defineView<ValueType>(
  component: ViewComponent<ValueType>
): ViewDefinition<ValueType, ValueType> {
  return { component };
}

export function defineTransformView<ValueType, ReturnType = ValueType>(
  component: ViewComponent<ValueType>,
  getReturnValue: (props: ViewComponentProps<ValueType>) => ReturnType
): ViewDefinition<ValueType, ReturnType> {
  return { component, getReturnValue };
}

export type ViewArgs<T extends StateBase, K extends keyof T & string, V, R> = [
  key: K,
  ...wrappers: Wrapper[],
  def: ViewDefinition<V, R>
];

export function useReactlitView<T extends StateBase>({
  set,
  display,
  state,
}: Pick<ReactlitContext<T>, 'set' | 'display' | 'state'>) {
  return useCallback<ReactlitContext<T>['view']>(
    <K extends keyof T & string, V, R>(...args: ViewArgs<T, K, V, R>) => {
      const [key, ...restArgs] = args;
      const [wrappers, def] = tail(restArgs);
      const { component, getReturnValue } = def;
      const props: ViewComponentProps<V> = {
        stateKey: key,
        value: state[key] as V,
        setValue: (value: any) => set(key, value),
      };
      display(key, ...wrappers, component(props));
      return getReturnValue ? getReturnValue(props) : (state[key] as R);
    },
    [state, set, display]
  );
}
