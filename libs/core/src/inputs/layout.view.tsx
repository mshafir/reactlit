import { useEffect, useRef } from 'react';
import tunnel from 'tunnel-rat';
import { ViewComponentProps } from '../builtins/types';
import { defineTransformView } from '../builtins/view';
import { Wrapper } from '../utils/apply-wrapper';

type Tunnel = ReturnType<typeof tunnel>;

type Repeat<
  T,
  C extends number,
  Result extends T[] = [],
  Counter extends any[] = []
> = Counter['length'] extends C
  ? Result
  : Repeat<T, C, [...Result, T], [...Counter, unknown]>;

// export function createLayoutSlot<T extends StateBase = StateBase>(
//   ctx: ReactlitContext<T>,
//   t: ReturnType<typeof tunnel>
// ): LayoutSlot<T> {
//   return {
//     display(...args) {
//       const node = args.length === 1 ? args[0] : args[1];
//       const manualKey = args.length === 1 ? undefined : args[0];
//       const wrappedNode = <t.In>{node}</t.In>;
//       const passArgs =
//         manualKey === undefined
//           ? ([wrappedNode] as const)
//           : ([manualKey, wrappedNode] as const);
//       ctx.display(...passArgs);
//     },
//     view<K extends keyof T & string, V, R>(key: K, def: ViewDefinition<V, R>) {
//       return ctx.view(key, {
//         ...def,
//         component: (props) => {
//           return <t.In key={props.stateKey}>{def.component(props)}</t.In>;
//         },
//       });
//     },
//   };
// }

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
  return defineTransformView<Repeat<Tunnel, N> | undefined, Repeat<Wrapper, N>>(
    (viewProps) => (
      <LayoutViewComponent {...viewProps} slots={slots} slotProps={slotProps} />
    ),
    ({ value }) => {
      const tunnels = (value ?? []) as Tunnel[];
      const wrappers = tunnels.map((t) => t.In);
      return wrappers as Repeat<Wrapper, N>;
    }
  );
}
