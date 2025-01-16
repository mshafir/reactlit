import { Fragment, ReactNode, useCallback, useState } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { ApplyWrappers, Wrapper } from '../wrappers';
import { tail } from '../utils/tail';
import { ReactlitContext, ReactlitProps, StateBase } from './types';

interface DisplayState {
  position: number;
  elements: [string, React.ReactNode][];
}

type KeyedDisplayArgs = [string, ...(Wrapper | 'default')[], ReactNode];
type UnkeyedDisplayArgs = [...(Wrapper | 'default')[], ReactNode];

export type DisplayArgs = KeyedDisplayArgs | UnkeyedDisplayArgs;

export function isKeyedDisplayArgs(
  args: DisplayArgs
): args is KeyedDisplayArgs {
  return args.length > 1 && typeof args[0] === 'string';
}

export function normalizeDisplayArgs(args: DisplayArgs) {
  const manualKey = isKeyedDisplayArgs(args) ? args[0] : undefined;
  const restArgs = isKeyedDisplayArgs(args)
    ? (args.slice(1) as UnkeyedDisplayArgs)
    : args;
  const [wrappers, node] = tail(restArgs);
  return {
    manualKey,
    wrappers,
    node,
  };
}

export function useReactlitDisplay<T extends StateBase>({
  renderError,
  wrapper,
}: Pick<ReactlitProps<T>, 'renderError' | 'wrapper'>) {
  const [renderState, setRenderState] = useState<DisplayState>({
    position: 0,
    elements: [],
  });

  const display = useCallback<ReactlitContext<T>['display']>(
    (...args: DisplayArgs) => {
      const { manualKey, wrappers, node } = normalizeDisplayArgs(args);

      setRenderState(({ position, elements }) => {
        const key = manualKey ?? `${position}`;
        const keyIndex = elements
          .slice(0, position)
          .findIndex(([k]) => manualKey && k === manualKey);

        const element = (
          <ReactErrorBoundary key={key} fallbackRender={renderError}>
            <ApplyWrappers
              wrappers={wrappers}
              defaultWrapper={wrapper}
              props={{
                position,
                stateKey: key,
              }}
            >
              {node}
            </ApplyWrappers>
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
    [setRenderState, renderError, wrapper]
  );

  const resetRenderPosition = useCallback(() => {
    setRenderState(({ elements }) => ({ elements, position: 0 }));
  }, [setRenderState]);

  // truncates stranded elements after the last position
  const finalizeRender = useCallback(() => {
    setRenderState(({ elements, position }) => ({
      position,
      elements: elements.slice(0, position),
    }));
  }, [setRenderState]);

  return {
    renderState,
    display,
    resetRenderPosition,
    finalizeRender,
  };
}
