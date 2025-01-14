import { Text, TextField } from '@radix-ui/themes';
import { defineView, ViewComponentProps } from '@reactlit/core';
import { isValidElement, ReactNode, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { LabelType, renderLabel } from '../label';

export type TextInputProps = Omit<TextField.RootProps, 'value' | 'children'> & {
  label?: LabelType;
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
  label,
  debounceDelay = 200,
  children,
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
    <Text as="label">
      {renderLabel(label)}
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
          ? children({ value, stateKey, setValue })
          : undefined}
      </TextField.Root>
    </Text>
  );
};

export const TextInput = (props: TextInputProps) =>
  defineView<string>((viewProps) => (
    <TextInputComponent {...viewProps} {...props} />
  ));
