import {
  defineView,
  ExtractDefProps,
  ViewComponentProps,
  withWrapper,
} from '@reactlit/core';
import { DetailedHTMLProps } from 'react';

type BaseCheckInputProps = Omit<
  DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  'value'
>;

export const CheckInputComponent = withWrapper(
  ({
    value,
    stateKey,
    setValue,
    onChange,
    ...props
  }: BaseCheckInputProps & ViewComponentProps<boolean>) => {
    return (
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => {
          setValue(e.target.checked);
          onChange?.(e);
        }}
        {...props}
      />
    );
  }
);

export type CheckInputProps = ExtractDefProps<typeof CheckInputComponent>;

export const CheckInput = (props: CheckInputProps) =>
  defineView<boolean>((viewProps) => (
    <CheckInputComponent {...viewProps} {...props} />
  ));
