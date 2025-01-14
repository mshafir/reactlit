import { Fragment, ReactNode, SetStateAction, useMemo } from 'react';
import { applyWrapper, Wrapper } from '../utils/apply-wrapper';
import { isSetStateFunction } from '../hooks/use-reactlit-state';
import { ViewComponentProps, ViewDefinition } from '../builtins/types';
import { defineView } from '../builtins/view';

export type FormDefMap<T> = {
  [K in keyof T]: ViewDefinition<T[K], T[K]>;
};

export interface FormViewProps<T> {
  form: FormDefMap<T>;
  wrapper?: Wrapper;
}

export function FormViewComponent<T>({
  form,
  value,
  stateKey,
  setValue,
  wrapper,
}: FormViewProps<T> & ViewComponentProps<T>) {
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

export function FormView<T>(
  form: FormDefMap<T>,
  props?: Omit<FormViewProps<T>, 'form'>
) {
  return defineView<T>((viewProps) => (
    <FormViewComponent form={form} {...props} {...viewProps} />
  ));
}
