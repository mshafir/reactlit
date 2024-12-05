import { Text, TextArea, TextAreaProps } from '@radix-ui/themes';
import {
  defineView,
  ExtractDefProps,
  ViewComponentProps,
  withWrapper,
} from '@reactlit/core';
import { useDebouncedCallback } from 'use-debounce';
import { LabelType, renderLabel } from '../label';
import { useEffect, useState } from 'react';

export type BaseTextAreaInputProps = Omit<TextAreaProps, 'value'> & {
  label?: LabelType;
  debounceDelay?: number;
};

export const TextAreaInputComponent = withWrapper(
  ({
    value,
    stateKey,
    setValue,
    onChange,
    label,
    debounceDelay = 300,
    ...props
  }: BaseTextAreaInputProps & ViewComponentProps<string>) => {
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
        <TextArea
          value={rawValue}
          onChange={(e) => {
            setRawValue(e.target.value);
            debouncedSetValue(e.target.value);
            onChange?.(e);
          }}
          {...props}
        />
      </Text>
    );
  }
);

export type TextAreaInputProps = ExtractDefProps<typeof TextAreaInputComponent>;

export const TextAreaInput = (props: TextAreaInputProps) =>
  defineView<string>((viewProps) => (
    <TextAreaInputComponent {...viewProps} {...props} />
  ));
