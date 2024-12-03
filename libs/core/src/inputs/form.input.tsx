import { ReactNode, SetStateAction, useMemo } from 'react';
import { def, ViewDefinition } from '../reactlit';
import { ViewComponentProps } from '../reactlit';
import { applyWrapper, Wrapper } from '../utils/with-wrapper';
import { isSetStateFunction } from '../hooks/use-reactlit-state';

export type FormDefMap<T> = {
  [K in keyof T]: ViewDefinition<T[K], any>;
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
      const View = def.component;
      const props = def.props;
      views.push(
        <View
          key={key}
          stateKey={`${stateKey}.${key}`}
          value={value?.[key]}
          setValue={(v: SetStateAction<any>) =>
            setValue({
              ...value,
              [key]: isSetStateFunction(v) ? v(value?.[key]) : v,
            })
          }
          {...props}
        />
      );
    }
    return views;
  }, [form, value, setValue, stateKey]);
  return applyWrapper(<>{views}</>, wrapper);
}

export function FormInput<T>(
  form: FormDefMap<T>,
  props?: Omit<FormInputProps<T>, 'form'>
) {
  return def(FormInputViewComponent<T>, { form, ...props });
}
