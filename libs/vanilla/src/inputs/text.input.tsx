import { defineView, ViewComponentProps } from '@reactlit/core';
import { DetailedHTMLProps } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export type TextInputProps = Omit<
  DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  'value'
> & {
  label?: string | React.ReactNode;
  debounceDelay?: number;
};

export const TextInputComponent = ({
  value,
  stateKey,
  setValue,
  onChange,
  debounceDelay = 200,
  label,
  ...props
}: TextInputProps & ViewComponentProps<string>) => {
  const debouncedSetValue = useDebouncedCallback((value) => {
    setValue(value);
  }, debounceDelay);
  return (
    <div className="flex gap-2 items-center">
      {label && <label htmlFor={props.id}>{label}</label>}
      <input
        type="text"
        defaultValue={value}
        onChange={(e) => {
          debouncedSetValue(e.target.value);
          onChange?.(e);
        }}
        {...props}
      />
    </div>
  );
};

export const TextInput = (props: TextInputProps) =>
  defineView<string>((viewProps) => (
    <TextInputComponent {...viewProps} {...props} />
  ));
