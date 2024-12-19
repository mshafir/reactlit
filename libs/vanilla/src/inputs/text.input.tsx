import {
  defineView,
  ExtractDefProps,
  ViewComponentProps,
  withWrapper,
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
  label?: string | React.ReactNode;
  debounceDelay?: number;
};

export const TextInputComponent = withWrapper(
  ({
    value,
    stateKey,
    setValue,
    onChange,
    debounceDelay = 200,
    label,
    ...props
  }: BaseTextInputProps & ViewComponentProps<string>) => {
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
  }
);

export type TextInputProps = ExtractDefProps<typeof TextInputComponent>;

export const TextInput = (props: TextInputProps) =>
  defineView<string>((viewProps) => (
    <TextInputComponent {...viewProps} {...props} />
  ));
