import { Button, ButtonProps } from '@radix-ui/themes';
import { defineView, ViewComponentProps } from '@reactlit/core';

export interface AsyncButtonInputProps
  extends Omit<
    ButtonProps,
    'loading' | 'children' | 'onClick' | 'content' | 'value'
  > {
  content: React.ReactNode;
  onClick: () => Promise<void>;
}

export const AsyncButtonViewComponent = ({
  content,
  onClick,
  setValue,
  value,
  stateKey,
  display,
  view,
  ...props
}: AsyncButtonInputProps & ViewComponentProps<boolean>) => {
  return (
    <div>
      <Button
        {...props}
        loading={value}
        onClick={async () => {
          setValue(true);
          try {
            await onClick();
          } finally {
            setValue(false);
          }
        }}
      >
        {content}
      </Button>
    </div>
  );
};

export const AsyncButton = (
  onClick: () => Promise<any>,
  props: Omit<AsyncButtonInputProps, 'onClick'>
) =>
  defineView<boolean>((viewProps) => (
    <AsyncButtonViewComponent {...viewProps} {...props} onClick={onClick} />
  ));
