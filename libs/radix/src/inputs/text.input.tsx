import { TextField } from '@radix-ui/themes';
import { defineView, ViewComponentProps } from '@reactlit/core';
import { isValidElement, ReactNode, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { LabelType } from '../label';

export type TextInputProps = Omit<TextField.RootProps, 'value' | 'children'> & {
  children?:
    | React.ReactNode
    | ((props: ViewComponentProps<string>) => React.ReactNode);
  debounceDelay?: number;
};

export const TextInputComponent = ({
  value,
  stateKey,
  setValue,
  onChange,
  debounceDelay = 200,
  children,
  display,
  view,
  ...props
}: TextInputProps & ViewComponentProps<string>) => {
  const [rawValue, setRawValue] = useState(value ?? '');
  const debouncedSetValue = useDebouncedCallback((value) => {
    setValue(value);
  }, debounceDelay);
  useEffect(() => {
    setRawValue(value ?? '');
  }, [value]);
  return (
    <TextField.Root
      value={rawValue}
      onChange={(e) => {
        setRawValue(e.target.value);
        debouncedSetValue(e.target.value);
        onChange?.(e);
      }}
      {...props}
    >
      {isValidElement(children)
        ? (children as ReactNode)
        : typeof children === 'function'
        ? children({ value, display, view, stateKey, setValue })
        : undefined}
    </TextField.Root>
  );
};

export const TextInput = (props?: TextInputProps) =>
  defineView<string>((viewProps) => (
    <TextInputComponent {...viewProps} {...props} />
  ));
