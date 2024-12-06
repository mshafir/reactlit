import { FormDefMap, FormInput, FormInputProps } from '@reactlit/core';
import { BaseProps, RadixConfig, getBaseProps } from './config';
import {
  AsyncButton,
  AsyncButtonInputProps,
} from './inputs/async-button.input';
import { CheckInput, CheckInputProps } from './inputs/check.input';
import { RadioInput, RadioInputProps } from './inputs/radio.input';
import { SearchInput, SearchInputProps } from './inputs/search.input';
import { SelectInput, SelectInputProps } from './inputs/select.input';
import {
  RangeSliderInput,
  SliderInput,
  SliderInputProps,
} from './inputs/slider.input';
import { TableInput, TableInputProps } from './inputs/table.input';
import { TextInput, TextInputProps } from './inputs/text.input';
import { TextAreaInput, TextAreaInputProps } from './inputs/textarea.input';
import { SwitchInput, SwitchInputProps } from './inputs/switch.input';

export function configureInputs(config?: RadixConfig) {
  const baseProps = getBaseProps(config);
  return {
    Text: (props: TextInputProps & BaseProps) =>
      TextInput({ ...baseProps, ...props }),
    TextArea: (props: TextAreaInputProps) =>
      TextAreaInput({ ...baseProps, ...props }),
    Check: <T extends string>(
      options: CheckInputProps<T>['options'],
      props?: Omit<CheckInputProps<T>, 'options'>
    ) => CheckInput<T>(options, { ...baseProps, ...props }),
    Switch: (props?: SwitchInputProps) =>
      SwitchInput({ ...baseProps, ...props }),
    Radio: <T extends string>(
      options: RadioInputProps<T>['options'],
      props?: Omit<RadioInputProps<T>, 'options'>
    ) => RadioInput<T>(options, { ...baseProps, ...props }),
    Select: <T extends string>(
      options: SelectInputProps<T>['options'],
      props?: Omit<SelectInputProps<T>, 'options'>
    ) => SelectInput<T>(options, { ...baseProps, ...props }),
    Form: <T>(form: FormDefMap<T>, props?: Omit<FormInputProps<T>, 'form'>) =>
      FormInput<T>(form, { ...baseProps, ...props }),
    Slider: (props: SliderInputProps) =>
      SliderInput({ ...baseProps, ...props }),
    RangeSlider: (props: SliderInputProps) =>
      RangeSliderInput({ ...baseProps, ...props }),
    AsyncButton: (
      onClick: () => Promise<any>,
      props: Omit<AsyncButtonInputProps, 'onClick'>
    ) => AsyncButton(onClick, { ...baseProps, ...props }),
    Table: <T, P extends Omit<TableInputProps<T>, 'data'>>(
      data: T[] | undefined,
      props: P
    ) => TableInput<T, P>(data, { ...baseProps, ...props }),
    Search: <T>(data: T[] | undefined, props: SearchInputProps<T>) =>
      SearchInput<T>(data, { ...baseProps, ...props }),
  };
}

export const Inputs = configureInputs();

export * from './default-wrapper';
