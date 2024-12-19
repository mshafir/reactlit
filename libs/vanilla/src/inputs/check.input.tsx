import {
  applyWrapper,
  defineTransformView,
  ExtractDefProps,
  ViewComponentProps,
} from '@reactlit/core';
import { DetailedHTMLProps } from 'react';
import { VanillaConfig } from '../config';

type BaseCheckInputProps<T> = Omit<
  DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  'value' | 'disabled'
> &
  VanillaConfig & {
    data: T[];
    label?: string | React.ReactNode;
    containerClassName?: string;
    format?: (value: T) => string | React.ReactNode;
    keyof?: (value: T) => string;
    valueof: (value: T) => string;
    disabled?: string[];
  };

export const CheckInputComponent = <T,>({
  value,
  stateKey,
  setValue,
  onChange,
  data,
  containerClassName,
  format,
  keyof,
  valueof,
  disabled,
  label,
  wrapper,
  ...props
}: BaseCheckInputProps<T> & ViewComponentProps<string[]>) => {
  return applyWrapper(
    <div className="flex gap-2 items-center">
      {label && <label htmlFor={stateKey}>{label}</label>}
      <div className={containerClassName}>
        {data.map((item, index) => {
          const isChecked = value.includes(valueof(item));

          return (
            <div key={keyof?.(item) ?? index}>
              <input
                type="checkbox"
                checked={isChecked}
                name={keyof?.(item) ?? item.toString()}
                onChange={(e) => {
                  const _value = valueof(item);
                  if (e.target.checked) setValue([...value, _value]);
                  else setValue(value.filter((v) => v !== _value));
                }}
                disabled={
                  (keyof && disabled?.includes(keyof(item))) ||
                  disabled?.includes(valueof(item))
                }
                {...props}
              />
              <label htmlFor={keyof?.(item) ?? item.toString()}>
                {format?.(item) ?? item.toString()}
              </label>
            </div>
          );
        })}
      </div>
    </div>,
    wrapper
  );
};

export type CheckInputProps<T> = Omit<
  ExtractDefProps<typeof CheckInputComponent<T>>,
  'data'
>;

export const CheckInput = <T,>(data: T[], props: CheckInputProps<T>) =>
  defineTransformView<string[], T[]>(
    (viewProps) => (
      <CheckInputComponent data={data} {...viewProps} {...props} />
    ),
    ({ value }) => {
      return value.map((v) => data.find((d) => props.valueof(d) === v));
    }
  );
