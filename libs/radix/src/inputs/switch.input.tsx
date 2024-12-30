import { Switch, SwitchProps } from '@radix-ui/themes';
import { defineView, ViewComponentProps } from '@reactlit/core';
import { LabelType, renderLabel } from '../label';

export type SwitchInputProps = Omit<
  SwitchProps,
  'checked' | 'onCheckedChange' | 'value' | 'onValueChange'
> & {
  label?: LabelType;
};

export const SwitchInputComponent = ({
  value,
  stateKey,
  setValue,
  label,
  ...props
}: SwitchInputProps & ViewComponentProps<boolean>) => {
  return (
    <>
      {renderLabel(label)}
      <Switch checked={value} onCheckedChange={setValue} {...props} />
    </>
  );
};

export const SwitchInput = (props?: SwitchInputProps) =>
  defineView<boolean>((viewProps) => (
    <SwitchInputComponent {...viewProps} {...props} />
  ));
