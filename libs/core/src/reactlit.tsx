import {
  ComponentType,
  Dispatch,
  Fragment,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { useDeepMemo } from './hooks/use-deep-memo';
import { useReactlitState } from './hooks/use-reactlit-state';
import { deepEqual } from './utils/deep-equal';
// import useVigilante from '@mollycule/vigilante';

export interface ViewComponentProps<T> {
  stateKey: string;
  value: T;
  setValue: Dispatch<T>;
}

export type ViewComponent<ValueType> = React.FC<ViewComponentProps<ValueType>>;

export interface ViewDefinition<ValueType, ReturnType = ValueType> {
  component: ViewComponent<ValueType>;
  getReturnValue?: (props: ViewComponentProps<ValueType>) => ReturnType;
}

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

export type ExtractDefProps<T> = T extends ComponentType<infer P>
  ? Omit<P, 'value' | 'setValue' | 'stateKey'>
  : never;

export type PromiseResult<T> =
  | {
      loading: true;
      data?: undefined;
      error?: undefined;
    }
  | {
      loading: false;
      data: T;
      error?: undefined;
    }
  | {
      loading: false;
      data?: undefined;
      error: Error;
    };

export type StateBase = Record<string, unknown>;

export type DisplayArgs = [string, ReactNode] | [ReactNode];

export interface ReactlitContext<T extends StateBase = any> {
  view: <K extends keyof T & string, V, R>(
    key: K,
    def: ViewDefinition<V, R>
  ) => R;
  set: <K extends keyof T & string>(key: K, value: T[K]) => T[K];
  display: (...args: DisplayArgs) => void;
  changed: (...keys: (keyof T)[]) => boolean;
  trigger: () => void;
  state: T;
}

type GenericPluginResult<Base, Plugin> = Plugin extends (ctx: Base) => infer C
  ? C
  : never;

type ApplyPlugins<Base, Plugins> = Plugins extends [infer Plugin, ...infer Rest]
  ? GenericPluginResult<Base, Plugin> & ApplyPlugins<Base, Rest>
  : {};

export type ReactlitPlugin<T extends StateBase, C> = (
  ctx: ReactlitContext<T>
) => C;

export type ReactlitPlugins<T extends StateBase> = ReactlitPlugin<T, any>[];

export type ReactlitPluginContext<
  T extends StateBase,
  P extends ReactlitPlugins<T>
> = ReactlitContext<T> & ApplyPlugins<ReactlitContext<T>, P>;

export function definePlugin<T extends StateBase = StateBase, C = any>(
  plugin: ReactlitPlugin<T, C>
) {
  return plugin;
}

export function usePlugin<C, T extends StateBase = StateBase>(
  plugin: ReactlitPlugin<T, C>,
  deps: any[]
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(plugin, deps);
}

export type ReactlitFunction<
  T extends StateBase = any,
  C extends ReactlitContext<T> = ReactlitContext<T>
> = (ctx: C) => Promise<void>;

export type ReactlitStateSetter<T> = <K extends keyof T>(
  key: K,
  value: SetStateAction<T[K]>
) => void;

export type ReactlitProps<T extends StateBase, P extends ReactlitPlugins<T>> = {
  state?: T;
  setState?: ReactlitStateSetter<T>;
  renderLoading?: (rendering: boolean) => ReactNode;
  renderError?: (props: {
    error: any;
    resetErrorBoundary: (...args: any[]) => void;
  }) => ReactNode;
  className?: string;
  plugins?: P;
  children: ReactlitFunction<T, ReactlitPluginContext<T, P>>;
};

function deltas<T extends StateBase>(
  state: T,
  previousState: T | undefined
): (keyof T)[] {
  return Object.keys(state).filter(
    (key: string) =>
      !previousState || !deepEqual(state[key], previousState[key])
  );
}

interface DisplayState {
  position: number;
  elements: [string, React.ReactNode][];
}

const defaultRenderError = ({ error }) => (
  <div style={{ color: 'red' }}>
    {'message' in error ? error.message : `${error}`}
  </div>
);

export function Reactlit<
  T extends StateBase = any,
  P extends ReactlitPlugins<T> = []
>({
  state: rawState,
  setState,
  renderLoading,
  renderError = defaultRenderError,
  plugins,
  children,
}: ReactlitProps<T, P>) {
  const appFunc = useCallback(
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

  const [defaultRawState, defaultSetState] = useReactlitState<T>({} as T);
  rawState = rawState ?? defaultRawState;
  setState = setState ?? defaultSetState;
  const [renderState, setRenderState] = useState<DisplayState>({
    position: 0,
    elements: [],
  });
  const state = useDeepMemo(() => rawState, [rawState]);
  const [previousState, setPreviousState] = useState<T>(state);

  const set = useCallback<ReactlitContext<T>['set']>(
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

  const display = useCallback<ReactlitContext<T>['display']>(
    (...args: DisplayArgs) => {
      const node = args.length === 1 ? args[0] : args[1];
      const manualKey = args.length === 1 ? undefined : args[0];
      setRenderState(({ position, elements }) => {
        const key = manualKey ?? `${position}`;
        const keyIndex = elements
          .slice(0, position)
          .findIndex(([k]) => manualKey && k === manualKey);
        const element = (
          <ReactErrorBoundary key={key} fallbackRender={renderError}>
            {node}
          </ReactErrorBoundary>
        );
        const newEntry = [key, element] as [string, React.ReactNode];

        if (keyIndex !== -1) {
          return {
            position,
            elements: [
              ...elements.slice(0, keyIndex),
              newEntry,
              ...elements.slice(keyIndex + 1),
            ],
          };
        } else if (position < elements.length) {
          return {
            position: position + 1,
            elements: [
              ...elements.slice(0, position),
              newEntry,
              // for manual keys that haven't been found by the above case
              // we don't want to overwrite the index element because
              // it's likely a different element
              ...elements
                .slice(position + (manualKey ? 0 : 1))
                .filter((e) => !manualKey || e[0] !== manualKey),
            ],
          };
        } else {
          return {
            position: elements.length + 1,
            elements: [...elements, newEntry],
          };
        }
      });
    },
    [setRenderState, renderError]
  );

  const view = useCallback<ReactlitContext<T>['view']>(
    <K extends keyof T & string, V, R>(
      key: K,
      { component, getReturnValue }: ViewDefinition<V, R>
    ) => {
      const value = state[key] as V;
      const props: ViewComponentProps<V> = {
        stateKey: key,
        value,
        setValue: (value: any) => set(key, value),
      };
      display(key, component(props));
      return getReturnValue ? getReturnValue(props) : (state[key] as R);
    },
    [state, set, display]
  );

  const changed = useCallback<ReactlitContext<T>['changed']>(
    (...keys) => {
      const changedKeys = deltas(state, previousState);
      const selectedChangedKeys = keys.filter((k) =>
        changedKeys.includes(k as string)
      );
      const isChanged = selectedChangedKeys.length > 0;
      if (isChanged) {
        for (const k of selectedChangedKeys) {
          // eslint-disable-next-line no-console
          console.debug(
            `changed ${String(k)}: ${previousState?.[k]} -> ${state[k]}`
          );
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
    [state, previousState]
  );

  const [triggerCounter, setTriggerCounter] = useState(0);
  const trigger = useCallback(() => {
    setTriggerCounter((c) => c + 1);
  }, [setTriggerCounter]);

  const childArgs = useMemo(
    () => ({ state, changed, set, view, display, trigger }),
    [state, changed, set, view, display, trigger]
  );

  const [rendering, setRendering] = useState(false);

  const renderLock = useRef(false);
  const renderAfter = useRef(false);
  useEffect(() => {
    async function runScript() {
      setRendering(true);
      if (renderLock.current) {
        renderAfter.current = true;
        return;
      }
      renderLock.current = true;
      try {
        // eslint-disable-next-line no-console
        console.debug('reactlit rendering:', childArgs.state);
        setRenderState(({ elements }) => ({ elements, position: 0 }));
        await appFunc(childArgs);
        setRenderState(({ elements, position }) => ({
          position,
          elements: elements.slice(0, position),
        }));
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error(e);
        display(
          renderError?.({ error: e, resetErrorBoundary: () => trigger() }) ?? (
            <></>
          )
        );
      } finally {
        renderLock.current = false;
        if (renderAfter.current) {
          renderAfter.current = false;
          trigger();
        } else {
          setRendering(false);
        }
      }
    }
    runScript();
  }, [
    appFunc,
    childArgs,
    triggerCounter,
    trigger,
    display,
    setRendering,
    setRenderState,
    renderError,
  ]);

  // NOTE: I leave this in whenever I have to debug infinite re-renders
  // useVigilante('re-render', {
  //   ...state,
  //   rawState,
  //   setState,
  //   triggerCounter,
  //   childArgs,
  //   children,
  // });

  return (
    <>
      {renderState.elements.map(([key, node]) => (
        <Fragment key={key}>{node}</Fragment>
      ))}
      {renderLoading?.(rendering) ?? <></>}
    </>
  );
}
