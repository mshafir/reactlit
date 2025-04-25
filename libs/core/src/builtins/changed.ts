import { useCallback } from "react";
import { deepEqual } from "../utils/deep-equal";
import { InternalReactlitState } from "./internal-state";
import { ReactlitContext, StateBase } from "./types";

function deltas<T extends StateBase>(
	state: T,
	previousState: T | undefined,
): (keyof T)[] {
	return Object.keys(state).filter(
		(key: string) =>
			!previousState || !deepEqual(state[key], previousState[key]),
	);
}

export function useReactlitChanged<T extends StateBase>(
	{ state, previousState, setPreviousState }: InternalReactlitState<T>,
	debug: boolean,
) {
	return useCallback<ReactlitContext<T>["changed"]>(
		(...keys) => {
			const changedKeys = deltas(state, previousState);
			const selectedChangedKeys = keys.filter((k) =>
				changedKeys.includes(k as string),
			);
			const isChanged = selectedChangedKeys.length > 0;
			if (isChanged) {
				if (debug) {
					for (const k of selectedChangedKeys) {
						// eslint-disable-next-line no-console
						console.debug(
							`changed ${String(k)}: ${previousState?.[k]} -> ${state[k]}`,
						);
					}
				}
				setPreviousState((prev) => {
					let newState = prev;
					for (const k of selectedChangedKeys) {
						newState = { ...newState, [k]: state[k] };
					}
					return newState;
				});
			}
			return isChanged;
		},
		[state, previousState, setPreviousState, debug],
	);
}
