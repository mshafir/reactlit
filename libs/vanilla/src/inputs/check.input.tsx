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
  'value' | 'disabled'
> & {
  containerClassName?: string;
  format?: (value: any) => string | React.ReactNode;
  keyof?: (value: any) => string | number;
  valueof?: (value: any) => string | number;
  options: string[] | Object[];
  disabled?: string[] | Object[];
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
    ...props
  }: BaseCheckInputProps & ViewComponentProps<string[] | Object[]>) => {
    return (
      <div className={containerClassName}>
        {options.map((item, index) => {
          const isChecked = valueof
            ? value.includes(valueof(item).toString())
            : !!value.find((v) => {
                if (keyof) return keyof?.(v) === keyof?.(item);
                else return v === item;
              });

          return (
            <div key={keyof?.(item) || index}>
              <input
                type="checkbox"
                checked={isChecked}
                name={keyof?.(item) || item}
                onChange={(e) => {
                  const _value = valueof?.(item) || item;
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
                  disabled?.includes(valueof?.(item) || item)
                }
                {...props}
              />
              <label htmlFor={keyof?.(item) || item}>
                {format?.(item) || item}
              </label>
            </div>
          );
        })}
      </div>
    );
  }
);

export type CheckInputProps = ExtractDefProps<typeof CheckInputComponent>;

export const CheckInput = (props: CheckInputProps) =>
  defineView<string[] | Object[]>((viewProps) => (
    <CheckInputComponent {...viewProps} {...props} />
  ));
