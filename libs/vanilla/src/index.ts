import { VanillaConfig } from './config';
import { TextInput, TextInputProps } from './inputs/text.input';

export function configureInputs(config?: VanillaConfig) {
  return {
    Text: (props?: TextInputProps) => TextInput({ ...config, ...props }),
  };
}

export const Inputs = configureInputs();
