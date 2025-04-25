import { useCallback, useMemo } from "react";
import {
	ReactlitContext,
	ReactlitFunction,
	ReactlitProps,
	StateBase,
} from "../builtins/types";
import { Reactlit } from "../reactlit";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type ReactlitPlugin<C = any> = (ctx: ReactlitContext<any>) => C;

export function definePlugin<C>(plugin: ReactlitPlugin<C>) {
	return plugin;
}

type GenericPluginResult<Plugin> = Plugin extends ReactlitPlugin<infer C>
	? C
	: never;

type ApplyPlugins<Plugins> = Plugins extends readonly [
	infer Plugin,
	...infer Rest,
]
	? GenericPluginResult<Plugin> & ApplyPlugins<Rest>
	: Record<string, never>;

export type ReactlitFunctionWithPlugins<
	T extends StateBase,
	P extends readonly ReactlitPlugin[],
> = ReactlitFunction<T, ApplyPlugins<P> & ReactlitContext<T>>;

export function useReactlit<P extends readonly ReactlitPlugin[]>(
	...plugins: P
) {
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	return useMemo(() => {
		function CustomReactlit<T extends StateBase>({
			children,
			...props
		}: Omit<ReactlitProps<T>, "children"> & {
			children: ReactlitFunction<T, ApplyPlugins<P> & ReactlitContext<T>>;
		}) {
			// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
			const func = useCallback(
				async (ctx: ReactlitContext<T>) => {
					return children(
						(plugins ?? []).reduce(
							(acc, plugin) => Object.assign({}, acc, plugin(ctx)),
							// biome-ignore lint/suspicious/noExplicitAny: <explanation>
							ctx as any,
						),
					);
				},
				// eslint-disable-next-line react-hooks/exhaustive-deps
				[children, ...(plugins ?? [])],
			);
			return <Reactlit {...props}>{func}</Reactlit>;
		}
		return CustomReactlit;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [...plugins]);
}
