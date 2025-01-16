import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useReactlitChanged } from './builtins/changed';
import { useReactlitDisplay } from './builtins/display';
import { useInternalReactlitState } from './builtins/internal-state';
import { useReactlitSet } from './builtins/set';
import { ReactlitProps, StateBase } from './builtins/types';
import { useReactlitView } from './builtins/view';
import { useReactlitState } from './hooks/use-reactlit-state';
import { Wrapper } from './wrappers';

const defaultRenderError = ({ error }) => (
  <div style={{ color: 'red' }}>
    {'message' in error ? error.message : `${error}`}
  </div>
);

const DefaultWrapper: Wrapper = ({ children }) => children;

export function Reactlit<T extends StateBase = any>({
  state: rawState,
  setState,
  renderLoading,
  renderError = defaultRenderError,
  debug,
  children,
  wrapper = DefaultWrapper,
}: ReactlitProps<T>) {
  const [defaultRawState, defaultSetState] = useReactlitState<T>({} as T);
  rawState = rawState ?? defaultRawState;
  setState = setState ?? defaultSetState;
  const internalState = useInternalReactlitState(rawState, setState);

  const { state } = internalState;
  const set = useReactlitSet(internalState);
  const changed = useReactlitChanged(internalState, debug);
  const { renderState, resetRenderPosition, finalizeRender, display } =
    useReactlitDisplay({ renderError, wrapper });
  const view = useReactlitView({ set, display, state });

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
        debug && console.debug('reactlit rendering:', childArgs.state);
        resetRenderPosition();
        await children(childArgs);
      } catch (e: any) {
        // eslint-disable-next-line no-console
        debug && console.error(e);
        display(
          renderError?.({ error: e, resetErrorBoundary: () => trigger() }) ?? (
            <></>
          )
        );
      } finally {
        finalizeRender();
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
    children,
    childArgs,
    triggerCounter,
    trigger,
    display,
    setRendering,
    resetRenderPosition,
    finalizeRender,
    renderError,
    debug,
  ]);

  return (
    <>
      {renderState.elements.map(([key, node]) => (
        <Fragment key={key}>{node}</Fragment>
      ))}
      {renderLoading?.(rendering) ?? <></>}
    </>
  );
}
