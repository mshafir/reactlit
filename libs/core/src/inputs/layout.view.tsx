import { Fragment, useEffect, useRef } from "react";
import { normalizeDisplayArgs } from "../builtins/display";
import {
	ReactlitContext,
	StateBase,
	ViewComponentProps,
} from "../builtins/types";
import {
	ViewArgs,
	defineTransformView,
	normalizeViewArgs,
} from "../builtins/view";
import tunnel from "../utils/tunnel";
import { SimpleWrapper, Wrapper, applySimpleWrapper } from "../wrappers";

export type Tunnel = ReturnType<typeof tunnel>;

export type Repeat<
	T,
	C extends number,
	Result extends T[] = [],
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	Counter extends any[] = [],
> = Counter["length"] extends C
	? Result
	: Repeat<T, C, [...Result, T], [...Counter, unknown]>;

export type LayoutSlot<T extends StateBase = StateBase> = Pick<
	ReactlitContext<T>,
	"display" | "view"
>;

// during initialization we create empty layout slots, these are only temporary
// until the state gets set up
export function createEmptyLayoutSlot<
	T extends StateBase = StateBase,
>(): LayoutSlot<T> {
	return {
		display: () => <></>,
		view<K extends keyof T & string, V, R>(...args: ViewArgs<T, K, V, R>) {
			return undefined as R;
		},
	};
}

export function createLayoutSlot<T extends StateBase = StateBase>(
	ctx: Pick<ReactlitContext<T>, "display" | "view">,
	t: ReturnType<typeof tunnel>,
): LayoutSlot<T> {
	const TunnelWrapper: Wrapper = ({ stateKey, position, children }) => {
		return (
			<t.In childKey={stateKey} order={position}>
				{children}
			</t.In>
		);
	};
	return {
		display(...args) {
			const { manualKey, wrappers, node } = normalizeDisplayArgs(args);
			if (manualKey) {
				ctx.display(manualKey, TunnelWrapper, ...wrappers, node);
			} else {
				ctx.display(TunnelWrapper, ...wrappers, node);
			}
		},
		view<K extends keyof T & string, V, R>(...args: ViewArgs<T, K, V, R>) {
			const { key, wrappers, def } = normalizeViewArgs(args);
			return ctx.view(key, TunnelWrapper, ...wrappers, def);
		},
	};
}

export function LayoutViewComponent<N extends number>({
	slots,
	value,
	setValue,
	slotWrapper,
}: {
	slots: N;
	slotWrapper?: SimpleWrapper;
} & ViewComponentProps<Repeat<Tunnel, N>>) {
	const tunnels = useRef<Tunnel[]>([]);
	useEffect(() => {
		if (tunnels.current.length !== slots) {
			tunnels.current = Array.from({ length: slots }, () => tunnel());
			setValue(tunnels.current as Repeat<Tunnel, N>);
		}
	}, [slots, setValue]);
	if (!value) return null;
	return (
		<>
			{(value as Tunnel[])
				.map((t) => t.Out)
				.map((Slot, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<Fragment key={index}>
						{applySimpleWrapper(<Slot />, slotWrapper)}
					</Fragment>
				))}
		</>
	);
}

export type LayoutViewType<N extends number> = Repeat<Tunnel, N> | undefined;

export function defaultLayoutState<N extends number>(
	slots: N,
): LayoutViewType<N> {
	return undefined;
}

export function LayoutView<N extends number>(
	slots: N,
	slotWrapper?: SimpleWrapper,
) {
	return defineTransformView<
		Repeat<Tunnel, N> | undefined,
		Repeat<LayoutSlot<StateBase>, N>
	>(
		(viewProps) => (
			<LayoutViewComponent
				{...viewProps}
				slots={slots}
				slotWrapper={slotWrapper}
			/>
		),
		({ value, display, view }) => {
			const tunnels = (value ?? []) as Tunnel[];
			if (tunnels.length !== slots) {
				return Array.from({ length: slots }, createEmptyLayoutSlot) as Repeat<
					LayoutSlot<StateBase>,
					N
				>;
			}
			const subContext = tunnels.map((t) =>
				createLayoutSlot({ display, view }, t),
			);
			return subContext as Repeat<LayoutSlot<StateBase>, N>;
		},
	);
}
