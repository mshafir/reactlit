import tunnel from 'tunnel-rat';
import {
  definePlugin,
  ReactlitContext,
  StateBase,
  ViewDefinition,
} from '../reactlit';

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

type SlotComponent = React.ComponentType<{}>;

type Tunnel = ReturnType<typeof tunnel>;

export type LayoutComponent<N extends number> = React.FC<{
  slots: Repeat<SlotComponent, N>;
}>;

type LayoutDefinition<N extends number> = {
  layout: React.ReactNode;
  tunnels: Repeat<Tunnel, N>;
};

export function defineLayout<N extends number>(
  slots: N,
  component: LayoutComponent<N>
): LayoutDefinition<N> {
  const tunnels = Array.from({ length: slots }, () => tunnel());
  return {
    layout: component({
      slots: tunnels.map((t) => t.Out) as Repeat<SlotComponent, N>,
    }),
    tunnels: tunnels as Repeat<Tunnel, N>,
  };
}

export interface LayoutPluginContext<T extends StateBase = StateBase> {
  layout<N extends number>(
    definition: LayoutDefinition<N>
  ): Repeat<LayoutSlot<T>, N>;
}

function createLayoutSlot<T extends StateBase = StateBase>(
  ctx: ReactlitContext<T>,
  t: ReturnType<typeof tunnel>
): LayoutSlot<T> {
  return {
    display(...args) {
      const node = args.length === 1 ? args[0] : args[1];
      const manualKey = args.length === 1 ? undefined : args[0];
      const wrappedNode = <t.In>{node}</t.In>;
      const passArgs =
        manualKey === undefined
          ? ([wrappedNode] as const)
          : ([manualKey, wrappedNode] as const);
      ctx.display(...passArgs);
    },
    view<K extends keyof T & string, V, R>(key: K, def: ViewDefinition<V, R>) {
      return ctx.view(key, {
        ...def,
        component: (props) => {
          return <t.In key={props.stateKey}>{def.component(props)}</t.In>;
        },
      });
    },
  };
}

export const TypedLayoutPlugin = <T extends StateBase>() =>
  definePlugin<T, LayoutPluginContext<T>>((ctx) => ({
    layout<N extends number>({
      layout,
      tunnels,
    }: LayoutDefinition<N>): Repeat<LayoutSlot, N> {
      const inputSlots: LayoutSlot[] = [];
      for (const t of tunnels as Tunnel[]) {
        inputSlots.push(createLayoutSlot(ctx, t));
      }
      ctx.display(layout);
      return inputSlots as Repeat<LayoutSlot, N>;
    },
  }));

export const LayoutPlugin = TypedLayoutPlugin<StateBase>();
