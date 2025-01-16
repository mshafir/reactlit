import { LayoutView, useReactlit } from '@reactlit/core';
import { TextInput } from './inputs/basic-text-input';

export default function LayoutExample() {
  const Reactlit = useReactlit();
  return (
    <Reactlit>
      {async ({ display, view }) => {
        const [col1, col2, col3] = view('cols', LayoutView(3));

        col1.display('First Name');
        const first = col1.view('first', TextInput);

        col2.display('Last Name');
        const last = col2.view('last', TextInput);

        col3.display('Hello to');
        col3.display(
          <div>
            {first} {last}
          </div>
        );
      }}
    </Reactlit>
  );
}
