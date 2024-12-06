import { Button, ButtonProps } from '@radix-ui/themes';
import { defineView, ViewComponentProps, withWrapper } from '@reactlit/core';

export interface AsyncButtonInputProps
  extends Omit<
    ButtonProps,
    'loading' | 'children' | 'onClick' | 'content' | 'value'
  > {
  content: React.ReactNode;
  onClick: () => Promise<void>;
}

export const AsyncButtonViewComponent = withWrapper(
  ({
    content,
    onClick,
    setValue,
    value,
    stateKey,
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
  }
);

export const AsyncButton = (
  onClick: () => Promise<any>,
  props: Omit<AsyncButtonInputProps, 'onClick'>
) =>
  defineView<boolean>((viewProps) => (
    <AsyncButtonViewComponent {...viewProps} {...props} onClick={onClick} />
  ));
