import { RadioGroup } from '@radix-ui/themes';
import { defineView, ViewComponentProps } from '@reactlit/core';
import { useMemo } from 'react';

export type RadioOptionsType<T> = T[] | Record<string, T>;

// Create a named type alias for the RadioGroup.RootProps
type NamedRadioGroupProps = Omit<
  RadioGroup.RootProps,
  'value' | 'onValueChange'
>;

// Update the BaseRadioInputProps to use the named type alias
export type BaseRadioInputProps<T extends string> = NamedRadioGroupProps & {
  options: RadioOptionsType<T>;
};

export const RadioInputComponent = <T extends string>({
  value,
  stateKey,
  setValue,
  options,
  ...props
}: BaseRadioInputProps<T> & ViewComponentProps<T | undefined>) => {
  const optionsEntries = useMemo(() => {
    if (Array.isArray(options)) {
      return options.map((o) => [o, o] as [string, T]);
    }
    return Object.entries(options) as [string, T][];
  }, [options]);
  return (
    <RadioGroup.Root value={value} onValueChange={setValue} {...props}>
      {optionsEntries.map(([label, value], i) => (
        <RadioGroup.Item key={i} value={value}>
          {label}
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
};

export type RadioInputProps<T extends string> = BaseRadioInputProps<T>;

export const RadioInput = <T extends string>(
  options: RadioOptionsType<T>,
  props?: Omit<RadioInputProps<T>, 'options'>
) =>
  defineView<T | undefined>((viewProps) => (
    <RadioInputComponent {...viewProps} {...props} options={options} />
  ));
