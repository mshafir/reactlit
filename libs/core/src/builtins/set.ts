import { useCallback } from 'react';
import { deepEqual } from '../utils/deep-equal';
import { ReactlitContext, StateBase } from './types';
import { InternalReactlitState } from './internal-state';

export function useReactlitSet<T extends StateBase>({
  state,
  setState,
  setPreviousState,
}: InternalReactlitState<T>) {
  return useCallback<ReactlitContext<T>['set']>(
    (key, value) => {
      setState(key, (prev) => {
        if (deepEqual(prev, value)) return prev;
        return value;
      });
      setPreviousState(state);
      return value;
    },
    [setState, state, setPreviousState]
  );
}
