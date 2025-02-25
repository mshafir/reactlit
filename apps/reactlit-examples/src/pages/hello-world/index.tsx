import { Reactlit, useReactlitState } from '@reactlit/core';
import { Inputs, Label } from '@reactlit/radix';

export default function HelloWorld() {
  const [appState, setAppState] = useReactlitState({
    name: '',
  });
  return (
    <Reactlit state={appState} setState={setAppState}>
      {async ({ display, view }) => {
        display(<div className="text-2xl">Hello World</div>);
        const name = view(
          'name',
          Label('Name'),
          Inputs.Text({
            placeholder: 'Enter your name',
          })
        );
        if (!name) {
          throw new Error('Please enter your name');
        }
        display(<div>Hello {name}!</div>);
      }}
    </Reactlit>
  );
}
