import {
  applyWrapper,
  defineTransformView,
  defineView,
  ViewComponentProps,
  ViewDefinition,
} from '@reactlit/core';
import { DetailedHTMLProps } from 'react';
import { VanillaConfig } from '../config';

export type CheckInputProps<T> = Omit<
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
    valueof?: (value: T) => string;
    keyof?: (value: T) => string;
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
}: CheckInputProps<T> & ViewComponentProps<(string | T)[]>) => {
  return applyWrapper(
    <div className="flex gap-2 items-center">
      {label && <label htmlFor={stateKey}>{label}</label>}
      <div className={containerClassName}>
        {data.map((item, index) => {
          const isChecked = !!value.find((v) =>
            valueof ? valueof(item) === v : item === v
          );

          return (
            <div key={keyof?.(item) ?? index}>
              <input
                type="checkbox"
                checked={isChecked}
                name={keyof?.(item) ?? item.toString()}
                onChange={(e) => {
                  const _value = valueof?.(item) ?? item;
                  if (e.target.checked) setValue([...value, _value]);
                  else setValue(value.filter((v) => v !== _value));
                }}
                disabled={
                  (keyof && disabled?.includes(keyof(item))) ||
                  disabled?.includes(valueof?.(item) ?? item.toString())
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

export type CheckInputDefinition<T, P> = P extends { valueof: (v: T) => string }
  ? ViewDefinition<string[], T[]>
  : ViewDefinition<T[]>;

export const CheckInput = <T, P extends CheckInputProps<T>>(
  data: P['data'],
  { valueof, ...props }: Omit<P, 'data'>
): CheckInputDefinition<T, P> => {
  if (valueof) {
    return defineTransformView<string[], T[]>(
      (viewProps) => (
        <CheckInputComponent
          data={data}
          {...viewProps}
          {...props}
          valueof={valueof}
        />
      ),
      ({ value }) => {
        return value.map((v) => data.find((d) => valueof(d) === v));
      }
    ) as CheckInputDefinition<T, P>;
  } else {
    return defineView<T[]>((viewProps) => (
      <CheckInputComponent data={data} {...viewProps} {...props} />
    )) as CheckInputDefinition<T, P>;
  }
};
