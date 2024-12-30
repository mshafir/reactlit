import { Select } from '@radix-ui/themes';
import { defineView, ViewComponentProps } from '@reactlit/core';
import { useMemo } from 'react';
import { LabelType, renderLabel } from '../label';

export type SelectOptionsType<T> = T[] | Record<string, T>;

// Create a named type alias for the SelectGroup.RootProps
type NamedSelectGroupProps = Omit<Select.RootProps, 'value' | 'onValueChange'>;

// Update the BaseSelectInputProps to use the named type alias
export type BaseSelectInputProps<T extends string> = NamedSelectGroupProps & {
  label?: LabelType;
  options: SelectOptionsType<T>;
};

export const SelectInputComponent = <T extends string>({
  value,
  stateKey,
  setValue,
  label,
  options,
  ...props
}: BaseSelectInputProps<T> & ViewComponentProps<T | undefined>) => {
  const optionsEntries = useMemo(() => {
    if (Array.isArray(options)) {
      return options.map((o) => [o, o] as [string, T]);
    }
    return Object.entries(options) as [string, T][];
  }, [options]);
  return (
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
    </>
  );
};

export type SelectInputProps<T extends string> = BaseSelectInputProps<T>;

export const SelectInput = <T extends string>(
  options: SelectOptionsType<T>,
  props?: Omit<SelectInputProps<T>, 'options'>
) =>
  defineView<T | undefined>((viewProps) => (
    <SelectInputComponent {...viewProps} {...props} options={options} />
  ));
