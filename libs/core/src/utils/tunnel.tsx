import React, { Fragment } from 'react';
import { create, StoreApi } from 'zustand';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect';

// modified from tunnel-rat

type Props = { childKey: string; children: React.ReactNode };

type State = {
  current: Array<{ childKey: string; node: React.ReactNode }>;
  version: number;
  set: StoreApi<State>['setState'];
};

export default function tunnel() {
  const useStore = create<State>((set) => ({
    current: new Array<{ childKey: string; node: React.ReactNode }>(),
    version: 0,
    set,
  }));

  return {
    In: ({ childKey, children }: Props) => {
      const set = useStore((state) => state.set);
      const version = useStore((state) => state.version);

      /* When this component mounts, we increase the store's version number.
      This will cause all existing rats to re-render (just like if the Out component
      were mapping items to a list.) The re-rendering will cause the final 
      order of rendered components to match what the user is expecting. */
      useIsomorphicLayoutEffect(() => {
        set((state) => ({
          version: state.version + 1,
        }));
      }, []);

      /* Any time the children _or_ the store's version number change, insert
      the specified React children into the list of rats. */
      useIsomorphicLayoutEffect(() => {
        set(({ current }) => {
          const existing = current.findIndex((c) => c.childKey === childKey);
          return {
            current:
              existing !== -1
                ? [
                    ...current.slice(0, existing),
                    { childKey, node: children },
                    ...current.slice(existing + 1),
                  ]
                : [...current, { childKey, node: children }],
          };
        });

        // remove the cleanup logic so that nodes stay in position, the key logic keeps things from getting too messy
        // return () =>
        //   set(({ current }) => ({
        //     current: current.filter((c) => c.node !== children),
        //   }));
      }, [children, version]);

      return null;
    },

    Out: () => {
      const current = useStore((state) => state.current);
      return (
        <>
          {current.map((c) => (
            <Fragment key={c.childKey}>{c.node}</Fragment>
          ))}
        </>
      );
    },
  };
}
