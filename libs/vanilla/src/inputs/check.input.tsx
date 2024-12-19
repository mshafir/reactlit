import {
  defineView,
  ExtractDefProps,
  ViewComponentProps,
  withWrapper,
} from '@reactlit/core';
import { DetailedHTMLProps } from 'react';

type CheckInputValue = string | Object;

type BaseCheckInputProps<T> = Omit<
  DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  'value' | 'disabled'
> & {
  label?: string | React.ReactNode;
  containerClassName?: string;
  format?: (value: T) => string | React.ReactNode;
  keyof?: (value: T) => string;
  valueof?: (value: T) => string;
  options: T[];
  disabled?: T[];
};

export const CheckInputComponent = withWrapper(
  ({
    value,
    stateKey,
    setValue,
    onChange,
    containerClassName,
    format,
    keyof,
    valueof,
    options,
    disabled,
    label,
    ...props
  }: BaseCheckInputProps<CheckInputValue> &
    ViewComponentProps<CheckInputValue[]>) => {
    return (
      <div className="flex gap-2 items-center">
        {label && <label htmlFor={props.id}>{label}</label>}
        <div className={containerClassName}>
          {options.map((item, index) => {
            const isChecked = valueof
              ? value.includes(valueof(item).toString())
              : !!value.find((v) => {
                  if (keyof) return keyof?.(v) === keyof?.(item);
                  else return v === item;
                });

            return (
              <div key={keyof?.(item) ?? index}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  name={keyof?.(item) ?? item.toString()}
                  onChange={(e) => {
                    const _value = valueof?.(item) ?? item;
                    if (e.target.checked) setValue([...value, _value]);
                    else
                      setValue(
                        value.filter((v) => {
                          if (valueof) {
                            return v !== _value;
                          } else if (keyof) {
                            return keyof(v) !== keyof(item);
                          }
                          return v !== _value;
                        })
                      );
                  }}
                  disabled={
                    (keyof && disabled?.includes(keyof(item).toString())) ||
                    disabled?.includes(valueof?.(item) ?? item)
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
      </div>
    );
  }
);

export type CheckInputProps = ExtractDefProps<typeof CheckInputComponent>;

export const CheckInput = (props: CheckInputProps) =>
  defineView<CheckInputValue[]>((viewProps) => (
    <CheckInputComponent {...viewProps} {...props} />
  ));
