import { Fragment, ReactNode, SetStateAction, useMemo } from 'react';
import { defineView, ViewDefinition } from '../reactlit';
import { ViewComponentProps } from '../reactlit';
import { applyWrapper, Wrapper } from '../utils/with-wrapper';
import { isSetStateFunction } from '../hooks/use-reactlit-state';

export type FormDefMap<T> = {
  [K in keyof T]: ViewDefinition<T[K], T[K]>;
};

export interface FormInputProps<T> {
  form: FormDefMap<T>;
  wrapper?: Wrapper;
}

export function FormInputViewComponent<T>({
  form,
  value,
  stateKey,
  setValue,
  wrapper,
}: FormInputProps<T> & ViewComponentProps<T>) {
  const views = useMemo(() => {
    const views: ReactNode[] = [];
    for (const key in form) {
      const def = form[key];
      const props = {
        stateKey: `${stateKey}.${key}`,
        value: value?.[key],
        setValue: (v: SetStateAction<any>) =>
          setValue({
            ...value,
            [key]: isSetStateFunction(v) ? v(value?.[key]) : v,
          }),
      };
      views.push(<Fragment key={key}>{def.component(props)}</Fragment>);
    }
    return views;
  }, [form, value, setValue, stateKey]);
  return applyWrapper(<>{views}</>, wrapper);
}

export function FormInput<T>(
  form: FormDefMap<T>,
  props?: Omit<FormInputProps<T>, 'form'>
) {
  return defineView<T>((viewProps) => (
    <FormInputViewComponent form={form} {...props} {...viewProps} />
  ));
}
