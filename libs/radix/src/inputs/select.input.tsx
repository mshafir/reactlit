import { Select } from '@radix-ui/themes';
import { applyWrapper, def, ViewComponentProps, Wrapper } from '@reactlit/core';
import { useMemo } from 'react';
import { LabelType, renderLabel } from '../label';
import { BaseProps } from '../config';

export type SelectOptionsType<T> = T[] | Record<string, T>;

// Create a named type alias for the SelectGroup.RootProps
type NamedSelectGroupProps = Omit<Select.RootProps, 'value' | 'onValueChange'>;

// Update the BaseSelectInputProps to use the named type alias
export type BaseSelectInputProps<T extends string> = NamedSelectGroupProps &
  BaseProps & {
    label?: LabelType;
    options: SelectOptionsType<T>;
  };

export const SelectInputComponent = <T extends string>({
  value,
  stateKey,
  setValue,
  label,
  options,
  wrapper,
  ...props
}: BaseSelectInputProps<T> & ViewComponentProps<T | undefined>) => {
  const optionsEntries = useMemo(() => {
    if (Array.isArray(options)) {
      return options.map((o) => [o, o] as [string, T]);
    }
    return Object.entries(options) as [string, T][];
  }, [options]);
  return applyWrapper(
    <>
      {renderLabel(label)}
      <Select.Root value={value} onValueChange={setValue} {...props}>
        <Select.Trigger />
        <Select.Content>
          {optionsEntries.map(([label, value], i) => (
            <Select.Item key={i} value={value}>
              {label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </>,
    wrapper
  );
};

export type SelectInputProps<T extends string> = BaseSelectInputProps<T>;

export const SelectInput = <T extends string>(
  options: SelectOptionsType<T>,
  props?: Omit<SelectInputProps<T>, 'options'>
) => def(SelectInputComponent<T>, { options, ...props } as SelectInputProps<T>);
