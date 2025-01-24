import { Switch, SwitchProps } from '@radix-ui/themes';
import { defineView, ViewComponentProps } from '@reactlit/core';

export type SwitchInputProps = Omit<
  SwitchProps,
  'checked' | 'onCheckedChange' | 'value' | 'onValueChange'
>;

export const SwitchInputComponent = ({
  value,
  stateKey,
  setValue,
  ...props
}: SwitchInputProps & ViewComponentProps<boolean>) => {
  return <Switch checked={value} onCheckedChange={setValue} {...props} />;
};

export const SwitchInput = (props?: SwitchInputProps) =>
  defineView<boolean>((viewProps) => (
    <SwitchInputComponent {...viewProps} {...props} />
  ));
