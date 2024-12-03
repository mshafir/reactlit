import { Slider, SliderProps } from '@radix-ui/themes';
import { def, ViewComponentProps, withWrapper } from '@reactlit/core';
import { LabelType, renderLabel } from '../label';

export type SliderInputProps = Omit<SliderProps, 'value' | 'onValueChange'> & {
  label?: LabelType;
};

export const SliderInputComponent = withWrapper(
  ({
    value,
    stateKey,
    setValue,
    onChange,
    label,
    ...props
  }: SliderInputProps & ViewComponentProps<number>) => {
    return (
      <>
        {renderLabel(label)}
        <Slider
          value={[value]}
          onValueChange={(v) => {
            setValue(v[0]);
          }}
          {...props}
        />
      </>
    );
  }
);

export const RangeSliderInputComponent = withWrapper(
  ({
    value,
    stateKey,
    setValue,
    onChange,
    label,
    ...props
  }: SliderInputProps & ViewComponentProps<[number, number]>) => {
    return (
      <>
        {renderLabel(label)}
        <Slider
          value={value}
          onValueChange={(v) => {
            setValue(v as [number, number]);
          }}
          {...props}
        />
      </>
    );
  }
);

export const SliderInput = (props: SliderInputProps) =>
  def(SliderInputComponent, props);

export const RangeSliderInput = (props: SliderInputProps) =>
  def(RangeSliderInputComponent, props);
