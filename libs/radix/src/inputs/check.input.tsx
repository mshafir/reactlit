import { CheckboxGroup } from '@radix-ui/themes';
import { applyWrapper, defineView, ViewComponentProps } from '@reactlit/core';
import { useMemo } from 'react';
import { BaseProps } from '../config';
import { LabelType, renderLabel } from '../label';

export type CheckOptionsType<T> = T[] | Record<string, T>;

export type BaseCheckInputProps<T extends string> = Omit<
  CheckboxGroup.RootProps,
  'value' | 'onValueChange'
> &
  BaseProps & {
    label?: LabelType;
    options: CheckOptionsType<T>;
  };

export const CheckInputComponent = <T extends string>({
  value,
  stateKey,
  setValue,
  label,
  options,
  wrapper,
  ...props
}: BaseCheckInputProps<T> & ViewComponentProps<T[]>) => {
  const optionsEntries = useMemo(() => {
    if (Array.isArray(options)) {
      return options.map((o) => [o, o] as [string, T]);
    }
    return Object.entries(options) as [string, T][];
  }, [options]);
  return applyWrapper(
    <>
      {renderLabel(label)}
      <CheckboxGroup.Root
        value={value ?? []}
        onValueChange={setValue}
        {...props}
      >
        {optionsEntries.map(([label, value], i) => (
          <CheckboxGroup.Item key={i} value={value}>
            {label}
          </CheckboxGroup.Item>
        ))}
      </CheckboxGroup.Root>
    </>,
    wrapper
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
