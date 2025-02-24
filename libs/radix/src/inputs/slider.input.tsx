import { Slider, SliderProps } from '@radix-ui/themes';
import { defineView, ViewComponentProps } from '@reactlit/core';
import { LabelType } from '../label';

export type SliderInputProps = Omit<SliderProps, 'value' | 'onValueChange'> & {
  label?: LabelType;
};

export const SliderInputComponent = ({
  value,
  stateKey,
  setValue,
  onChange,
  label,
  display,
  view,
  ...props
}: SliderInputProps & ViewComponentProps<number>) => {
  return (
    <Slider
      value={[value]}
      onValueChange={(v) => {
        setValue(v[0]);
      }}
      {...props}
    />
  );
};

export const RangeSliderInputComponent = ({
  value,
  stateKey,
  setValue,
  onChange,
  label,
  display,
  view,
  ...props
}: SliderInputProps & ViewComponentProps<[number, number]>) => {
  return (
    <Slider
      value={value}
      onValueChange={(v) => {
        setValue(v as [number, number]);
      }}
      {...props}
    />
  );
};

export const SliderInput = (props: SliderInputProps) =>
  defineView<number>((viewProps) => (
    <SliderInputComponent {...viewProps} {...props} />
  ));

export const RangeSliderInput = (props: SliderInputProps) =>
  defineView<[number, number]>((viewProps) => (
    <RangeSliderInputComponent {...viewProps} {...props} />
  ));
