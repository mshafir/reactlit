import { TextArea, TextAreaProps } from '@radix-ui/themes';
import { defineView, ViewComponentProps } from '@reactlit/core';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export type TextAreaInputProps = Omit<TextAreaProps, 'value'> & {
  debounceDelay?: number;
};

export const TextAreaInputComponent = ({
  value,
  stateKey,
  setValue,
  onChange,
  debounceDelay = 300,
  ...props
}: TextAreaInputProps & ViewComponentProps<string>) => {
  const [rawValue, setRawValue] = useState(value ?? '');
  const debouncedSetValue = useDebouncedCallback((value) => {
    setValue(value);
  }, debounceDelay);
  useEffect(() => {
    setRawValue(value ?? '');
  }, [value]);
  return (
    <TextArea
      value={rawValue}
      onChange={(e) => {
        setRawValue(e.target.value);
        debouncedSetValue(e.target.value);
        onChange?.(e);
      }}
      {...props}
    />
  );
};

export const TextAreaInput = (props: TextAreaInputProps) =>
  defineView<string>((viewProps) => (
    <TextAreaInputComponent {...viewProps} {...props} />
  ));
