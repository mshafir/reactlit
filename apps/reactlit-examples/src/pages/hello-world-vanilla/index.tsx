import { Reactlit, useReactlitState } from '@reactlit/core';
import { configureInputs } from '@reactlit/vanilla';

const Inputs = configureInputs({
  wrapper: (children) => (
    <div className="flex gap-2 items-center">
      <label htmlFor="name-input">Name</label>
      {children}
    </div>
  ),
});

export default function HelloWorldVanilla() {
  const [appState, setAppState] = useReactlitState({
    name: '',
  });
  return (
    <Reactlit state={appState} setState={setAppState}>
      {async ({ display, view }) => {
        display(<div className="text-2xl">Hello World Vanilla</div>);
        const name = view(
          'name',
          Inputs.Text({
            id: 'name-input',
            className: 'border p-0.5',
            placeholder: 'Enter your name',
          })
        );
        display(<div>Hello {name}!</div>);
      }}
    </Reactlit>
  );
}
