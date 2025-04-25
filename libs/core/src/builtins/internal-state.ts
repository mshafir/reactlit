import { useState } from "react";
import { useDeepMemo } from "../hooks/use-deep-memo";
import { ReactlitStateSetter, StateBase } from "./types";

export interface InternalReactlitState<T extends StateBase> {
	state: T;
	setState: ReactlitStateSetter<T>;
	previousState: T;
	setPreviousState: React.Dispatch<React.SetStateAction<T>>;
}

export function useInternalReactlitState<T extends StateBase>(
	rawState: T,
	setState: ReactlitStateSetter<T>,
): InternalReactlitState<T> {
	const state = useDeepMemo(() => rawState, [rawState]);
	const [previousState, setPreviousState] = useState<T>(state);

	return {
		state,
		setState,
		previousState,
		setPreviousState,
	};
}
