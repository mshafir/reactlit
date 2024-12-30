import { FormInput } from '@reactlit/core';
import { AsyncButton } from './inputs/async-button.input';
import { CheckInput } from './inputs/check.input';
import { RadioInput } from './inputs/radio.input';
import { SearchInput } from './inputs/search.input';
import { SelectInput } from './inputs/select.input';
import { RangeSliderInput, SliderInput } from './inputs/slider.input';
import { SwitchInput } from './inputs/switch.input';
import { TableInput } from './inputs/table.input';
import { TextInput } from './inputs/text.input';
import { TextAreaInput } from './inputs/textarea.input';

export const Inputs = {
  Text: TextInput,
  TextArea: TextAreaInput,
  Check: CheckInput,
  Switch: SwitchInput,
  Radio: RadioInput,
  Select: SelectInput,
  Form: FormInput,
  Slider: SliderInput,
  RangeSlider: RangeSliderInput,
  AsyncButton: AsyncButton,
  Table: TableInput,
  Search: SearchInput,
};
