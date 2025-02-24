import { LayoutView, useReactlit } from '@reactlit/core';
import { TextInput } from './inputs/basic-text-input';

export default function LayoutExample() {
  const Reactlit = useReactlit();
  return (
    <Reactlit>
      {async ({ view }) => {
        const [col1, col2, col3] = view(
          'cols',
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '1rem',
              alignItems: 'end',
            }}
          />,
          // the second argument here wraps each slot in a div so that they show
          // up as a single grid column in the layout
          LayoutView(3, <div />)
        );

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
