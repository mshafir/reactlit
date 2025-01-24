import { Text } from '@radix-ui/themes';

export type LabelType = string | React.ReactNode;

export const Label: React.FC<React.PropsWithChildren<{ label: LabelType }>> = ({
  label,
  children,
}) => {
  return (
    <Text as="label">
      <Text>{label}</Text>
      {children}
    </Text>
  );
};
