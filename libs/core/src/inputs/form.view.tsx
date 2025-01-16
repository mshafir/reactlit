import { Fragment, ReactNode, SetStateAction, useMemo } from 'react';
import { ViewComponentProps, ViewDefinition } from '../builtins/types';
import { defineView } from '../builtins/view';
import { isSetStateFunction } from '../hooks/use-reactlit-state';

export type FormDefMap<T> = {
  [K in keyof T]: ViewDefinition<T[K], T[K]>;
};

export interface FormViewProps<T> {
  form: FormDefMap<T>;
  wrapperProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
}

export function FormViewComponent<T>({
  form,
  value,
  stateKey,
  setValue,
  display,
  view,
  wrapperProps,
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
        display,
        view,
      };
      views.push(<Fragment key={key}>{def.component(props)}</Fragment>);
    }
    return views;
  }, [form, value, setValue, stateKey, display, view]);
  return <div {...wrapperProps}>{views}</div>;
}

export function FormView<T>(
  form: FormDefMap<T>,
  props?: FormViewProps<T>['wrapperProps']
) {
  return defineView<T>((viewProps) => (
    <FormViewComponent form={form} {...props} {...viewProps} />
  ));
}
