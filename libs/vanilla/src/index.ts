import { VanillaConfig } from './config';
import { CheckInput, CheckInputProps } from './inputs/check.input';
import { TextInput, TextInputProps } from './inputs/text.input';

export function configureInputs(config?: VanillaConfig) {
  return {
    Text: (props?: TextInputProps) => TextInput({ ...config, ...props }),
    Check: (props?: CheckInputProps) => CheckInput({ ...config, ...props }),
  };
}

export const Inputs = configureInputs();
