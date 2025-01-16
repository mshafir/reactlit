import { useEffect, useRef } from 'react';
import tunnel from 'tunnel-rat';
import {
  ReactlitContext,
  StateBase,
  ViewComponentProps,
  ViewDefinition,
} from '../builtins/types';
import {
  defineTransformView,
  normalizeViewArgs,
  ViewArgs,
} from '../builtins/view';
import { Wrapper } from '../wrappers';
import { isKeyedDisplayArgs, normalizeDisplayArgs } from '../builtins/display';
import { tail } from '../utils/tail';

type Tunnel = ReturnType<typeof tunnel>;

type Repeat<
  T,
  C extends number,
  Result extends T[] = [],
  Counter extends any[] = []
> = Counter['length'] extends C
  ? Result
  : Repeat<T, C, [...Result, T], [...Counter, unknown]>;

export type LayoutSlot<T extends StateBase = StateBase> = Pick<
  ReactlitContext<T>,
  'display' | 'view'
>;

function createLayoutSlot<T extends StateBase = StateBase>(
  ctx: Pick<ReactlitContext<T>, 'display' | 'view'>,
  t: ReturnType<typeof tunnel>
): LayoutSlot<T> {
  return {
    display(...args) {
      const { manualKey, wrappers, node } = normalizeDisplayArgs(args);
      if (manualKey) {
        ctx.display(manualKey, t.In as Wrapper, 'default', ...wrappers, node);
      } else {
        ctx.display(t.In as Wrapper, 'default', ...wrappers, node);
      }
    },
    view<K extends keyof T & string, V, R>(...args: ViewArgs<T, K, V, R>) {
      const { key, wrappers, def } = normalizeViewArgs(args);
      return ctx.view(key, t.In as Wrapper, 'default', ...wrappers, def);
    },
  };
}

export function LayoutViewComponent<N extends number>({
  slots,
  value,
  setValue,
  slotProps,
}: {
  slots: N;
  slotProps: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
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
          <div key={index} {...slotProps}>
            <Slot />
          </div>
        ))}
    </>
  );
}

export function LayoutView<N extends number>(
  slots: N,
  slotProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
) {
  return defineTransformView<
    Repeat<Tunnel, N> | undefined,
    Repeat<LayoutSlot<StateBase>, N>
  >(
    (viewProps) => (
      <LayoutViewComponent {...viewProps} slots={slots} slotProps={slotProps} />
    ),
    ({ value, display, view }) => {
      const tunnels = (value ?? []) as Tunnel[];
      const subContext = tunnels.map((t) =>
        createLayoutSlot({ display, view }, t)
      );
      return subContext as Repeat<LayoutSlot<StateBase>, N>;
    }
  );
}
