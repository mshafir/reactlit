import { CheckboxGroup } from '@radix-ui/themes';
import { defineView, ViewComponentProps } from '@reactlit/core';
import { useMemo } from 'react';
import { LabelType } from '../label';

export type CheckOptionsType<T> = T[] | Record<string, T>;

export type BaseCheckInputProps<T extends string> = Omit<
  CheckboxGroup.RootProps,
  'value' | 'onValueChange'
> & {
  label?: LabelType;
  options: CheckOptionsType<T>;
};

export const CheckInputComponent = <T extends string>({
  value,
  stateKey,
  setValue,
  label,
  options,
  display,
  view,
  ...props
}: BaseCheckInputProps<T> & ViewComponentProps<T[]>) => {
  const optionsEntries = useMemo(() => {
    if (Array.isArray(options)) {
      return options.map((o) => [o, o] as [string, T]);
    }
    return Object.entries(options) as [string, T][];
  }, [options]);
  return (
    <CheckboxGroup.Root value={value ?? []} onValueChange={setValue} {...props}>
      {optionsEntries.map(([label, value], i) => (
        <CheckboxGroup.Item key={i} value={value}>
          {label}
        </CheckboxGroup.Item>
      ))}
    </CheckboxGroup.Root>
  );
};

export type CheckInputProps<T extends string> = BaseCheckInputProps<T>;

export const CheckInput = <T extends string>(
  options: CheckOptionsType<T>,
  props?: Omit<CheckInputProps<T>, 'options'>
) =>
  defineView<T[]>((viewProps) => (
    <CheckInputComponent {...viewProps} {...props} options={options} />
  ));
