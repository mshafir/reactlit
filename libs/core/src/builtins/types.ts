import { Dispatch, ReactNode, SetStateAction } from 'react';
import { Wrapper } from '../wrappers';
import { DisplayArgs } from './display';
import { ViewArgs } from './view';

export type StateBase = Record<string, unknown>;

export interface ViewComponentProps<T> {
  stateKey: string;
  value: T;
  setValue: Dispatch<T>;
  display: (...args: DisplayArgs) => void;
  view: <T extends StateBase, K extends keyof T & string, V, R>(
    ...args: ViewArgs<T, K, V, R>
  ) => R;
}

export type ViewComponent<ValueType> = React.FC<ViewComponentProps<ValueType>>;

export interface ViewDefinition<ValueType, ReturnType = ValueType> {
  component: ViewComponent<ValueType>;
  getReturnValue?: (props: ViewComponentProps<ValueType>) => ReturnType;
}

export interface ReactlitContext<T extends StateBase = any> {
  view: <K extends keyof T & string, V, R>(...args: ViewArgs<T, K, V, R>) => R;
  set: <K extends keyof T & string>(key: K, value: T[K]) => T[K];
  display: (...args: DisplayArgs) => void;
  changed: (...keys: (keyof T)[]) => boolean;
  trigger: () => void;
  state: T;
}

export type ReactlitStateSetter<T> = <K extends keyof T>(
  key: K,
  value: SetStateAction<T[K]>
) => void;

export type ReactlitFunction<
  T extends StateBase = any,
  C extends ReactlitContext<T> = ReactlitContext<T>
> = (ctx: C) => Promise<void>;

export type ReactlitProps<T extends StateBase> = {
  state?: T;
  setState?: ReactlitStateSetter<T>;
  /**
   * Render function to display a loading message
   */
  renderLoading?: (rendering: boolean) => ReactNode;
  /**
   * Render function to display an error message
   */
  renderError?: (props: {
    error: any;
    resetErrorBoundary: (...args: any[]) => void;
  }) => ReactNode;
  /**
   * Whether to log debug messages to the console
   */
  debug?: boolean;
  /**
   * Wrapper to apply around all displayed elements
   */
  wrapper?: Wrapper;
  /**
   * Function for the Reactlit rendering logic
   */
  children: ReactlitFunction<T>;
};
