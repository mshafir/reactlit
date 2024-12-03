import { Text } from '@radix-ui/themes';

export type LabelType = string | React.ReactNode;

export const renderLabel = (label?: LabelType) => {
  if (!label) return null;
  if (typeof label === 'string') {
    return <Text>{label}</Text>;
  }
  return label;
};
