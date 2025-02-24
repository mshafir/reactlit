import { TextArea, TextAreaProps } from '@radix-ui/themes';
import { defineView, ViewComponentProps } from '@reactlit/core';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { LabelType } from '../label';

export type TextAreaInputProps = Omit<TextAreaProps, 'value'> & {
  label?: LabelType;
  debounceDelay?: number;
};

export const TextAreaInputComponent = ({
  value,
  stateKey,
  setValue,
  onChange,
  label,
  display,
  view,
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
