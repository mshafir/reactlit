import { SetStateAction, useCallback, useMemo, useState } from 'react';

export type StateAndSetter<T> = [T, React.Dispatch<React.SetStateAction<T>>];

export function isSetStateFunction<T>(
  value: T | ((prev: T) => void)
): value is (prev: T) => void {
  return typeof value === 'function';
}

export type ComboState<T extends Record<string, unknown>> = {
  [K in keyof T]: StateAndSetter<T[K]>;
};

export type ComboStateResult<T extends Record<string, unknown>> = [
  T,
  ComboStateSetter<T>
];

export type ComboStateSetter<T extends Record<string, unknown>> = <
  K extends keyof T
>(
  key: K,
  value: SetStateAction<T[K]>
) => void;

export function useCompoundReaclitState<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>
>(
  states: ComboState<T>,
  defaultStateSetter: StateAndSetter<U>
): ComboStateResult<T & U> {
  const [defaultState, defaultSetter] = defaultStateSetter;
  const state = useMemo(() => {
    const newState: any = {};
    for (const key in states) {
      newState[key] = states[key][0];
    }
    return { ...newState, ...defaultState };
  }, [states, defaultState]);

  const setState = useCallback<ComboStateSetter<T & U>>(
    <K extends keyof (T & U)>(key: K, value: SetStateAction<(T & U)[K]>) => {
      if (key in states) {
        states[key as keyof T][1](value as SetStateAction<T[keyof T]>);
      } else {
        defaultSetter((p) => ({
          ...p,
          [key]: isSetStateFunction(value)
            ? value(p[key as keyof U] as any)
            : value,
        }));
      }
    },
    [states, defaultSetter]
  );

  return [state, setState];
}

export function useReactlitState<T extends Record<string, unknown>>(
  initialState: T
): ComboStateResult<T> {
  return useCompoundReaclitState({}, useState(initialState));
}
