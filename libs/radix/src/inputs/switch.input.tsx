import { Switch, SwitchProps } from '@radix-ui/themes';
import { applyWrapper, defineView, ViewComponentProps } from '@reactlit/core';
import { BaseProps } from '../config';
import { LabelType, renderLabel } from '../label';

export type SwitchInputProps = Omit<
  SwitchProps,
  'checked' | 'onCheckedChange' | 'value' | 'onValueChange'
> &
  BaseProps & {
    label?: LabelType;
  };

export const SwitchInputComponent = ({
  value,
  stateKey,
  setValue,
  label,
  wrapper,
  ...props
}: SwitchInputProps & ViewComponentProps<boolean>) => {
  return applyWrapper(
    <>
      {renderLabel(label)}
      <Switch checked={value} onCheckedChange={setValue} {...props} />
    </>,
    wrapper
  );
};

export const SwitchInput = (props?: SwitchInputProps) =>
  defineView<boolean>((viewProps) => (
    <SwitchInputComponent {...viewProps} {...props} />
  ));
