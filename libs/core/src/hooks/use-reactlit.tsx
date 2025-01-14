import { useCallback, useMemo } from 'react';
import { Reactlit } from '../reactlit';
import {
  ReactlitContext,
  ReactlitFunction,
  ReactlitProps,
  StateBase,
} from '../builtins/types';

export type ReactlitPlugin<C> = (ctx: ReactlitContext<any>) => C;

export function definePlugin<C>(plugin: ReactlitPlugin<C>) {
  return plugin;
}

type GenericPluginResult<Plugin> = Plugin extends ReactlitPlugin<infer C>
  ? C
  : never;

type ApplyPlugins<Plugins> = Plugins extends readonly [
  infer Plugin,
  ...infer Rest
]
  ? GenericPluginResult<Plugin> & ApplyPlugins<Rest>
  : Record<string, never>;

export type ReactlitFunctionWithPlugins<
  T extends StateBase,
  P extends readonly ReactlitPlugin<any>[]
> = ReactlitFunction<T, ApplyPlugins<P> & ReactlitContext<T>>;

export function useReactlit<P extends readonly ReactlitPlugin<any>[]>(
  ...plugins: P
) {
  return useMemo(() => {
    function CustomReactlit<T extends StateBase>({
      children,
      ...props
    }: Omit<ReactlitProps<T>, 'children'> & {
      children: ReactlitFunction<T, ApplyPlugins<P> & ReactlitContext<T>>;
    }) {
      const func = useCallback(
        async (ctx: ReactlitContext<T>) => {
          return children(
            (plugins ?? []).reduce(
              (acc, plugin) => ({ ...acc, ...plugin(ctx) }),
              ctx as any
            )
          );
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [children, ...(plugins ?? [])]
      );
      return <Reactlit {...props}>{func}</Reactlit>;
    }
    return CustomReactlit;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...plugins]);
}
