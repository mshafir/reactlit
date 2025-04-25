import { useCallback } from "react";
import { tail } from "../utils/tail";
import { Wrapper } from "../wrappers";
import {
	ReactlitContext,
	StateBase,
	ViewComponent,
	ViewComponentProps,
	ViewDefinition,
} from "./types";

export function defineView<ValueType>(
	component: ViewComponent<ValueType>,
): ViewDefinition<ValueType, ValueType> {
	return { component };
}

export function defineTransformView<ValueType, ReturnType = ValueType>(
	component: ViewComponent<ValueType>,
	getReturnValue: (props: ViewComponentProps<ValueType>) => ReturnType,
): ViewDefinition<ValueType, ReturnType> {
	return { component, getReturnValue };
}

export type ViewArgs<T extends StateBase, K extends keyof T & string, V, R> = [
	key: K,
	...wrappers: Wrapper[],
	def: ViewDefinition<V, R>,
];

export function normalizeViewArgs<
	T extends StateBase,
	K extends keyof T & string,
	V,
	R,
>(args: ViewArgs<T, K, V, R>) {
	const [key, ...restArgs] = args;
	const [wrappers, def] = tail(restArgs);
	return { key, wrappers, def };
}

function makeViewFunction<T extends StateBase>({
	set,
	display,
	state,
}: Pick<ReactlitContext<T>, "set" | "display" | "state">) {
	return function view<K extends keyof T & string, V, R>(
		...args: ViewArgs<T, K, V, R>
	) {
		const { key, wrappers, def } = normalizeViewArgs(args);
		const { component, getReturnValue } = def;
		const props: ViewComponentProps<V> = {
			stateKey: key,
			value: state[key] as V,
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			setValue: (value: any) => set(key, value),
			display,
			view,
		};
		display(key, ...wrappers, component(props));
		return getReturnValue ? getReturnValue(props) : (state[key] as R);
	};
}

export function useReactlitView<T extends StateBase>({
	set,
	display,
	state,
}: Pick<ReactlitContext<T>, "set" | "display" | "state">) {
	return useCallback<ReactlitContext<T>["view"]>(
		<K extends keyof T & string, V, R>(...args: ViewArgs<T, K, V, R>) =>
			makeViewFunction({ set, display, state })(...args),
		[state, set, display],
	);
}
