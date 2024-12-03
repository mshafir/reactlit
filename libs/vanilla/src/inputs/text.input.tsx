import {
  def,
  ExtractDefProps,
  ViewComponentProps,
  withWrapper,
  Wrapper,
} from '@reactlit/core';
import { DetailedHTMLProps } from 'react';
import { useDebouncedCallback } from 'use-debounce';

type BaseTextInputProps = Omit<
  DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  'value'
> & {
  debounceDelay?: number;
};

export const TextInputComponent = withWrapper(
  ({
    value,
    stateKey,
    setValue,
    onChange,
    debounceDelay = 200,
    ...props
  }: BaseTextInputProps & ViewComponentProps<string>) => {
    const debouncedSetValue = useDebouncedCallback((value) => {
      setValue(value);
    }, debounceDelay);
    return (
      <input
        type="text"
        defaultValue={value}
        onChange={(e) => {
          debouncedSetValue(e.target.value);
          onChange?.(e);
        }}
        {...props}
      />
    );
  }
);

export type TextInputProps = ExtractDefProps<typeof TextInputComponent>;

export const TextInput = (props: TextInputProps) =>
  def(TextInputComponent, props);
