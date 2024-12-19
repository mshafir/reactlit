import { Reactlit, useReactlitState } from '@reactlit/core';
import { configureInputs } from '@reactlit/vanilla';

const Inputs = (label: string) =>
  configureInputs({
    wrapper: (children) => (
      <div className="flex gap-2 items-center">
        <label htmlFor="name-input">{label}</label>
        {children}
      </div>
    ),
  });

export default function HelloWorldVanilla() {
  const [appState, setAppState] = useReactlitState({
    name: '',
    pickedNumbers: [],
    pickedColors: [],
  });
  return (
    <Reactlit state={appState} setState={setAppState}>
      {async ({ display, view }) => {
        display(<div className="text-2xl">Hello World Vanilla</div>);
        const name = view(
          'name',
          Inputs('Name').Text({
            id: 'name-input',
            className: 'border p-0.5',
            placeholder: 'Enter your name',
          })
        );
        display(<div>Hello {name}!</div>);
        const picked = view(
          'pickedNumbers',
          Inputs('Pick any number').Check({
            id: 'number-input',
            className: 'border p-0.5 mr-1',
            containerClassName: 'flex gap-2',
            options: ['One', 'Two', 'Three'],
          })
        );
        display(<div>Picked: {picked.join(', ')}!</div>);
        const pickedColors = view(
          'pickedColors',
          Inputs('Pick any color').Check({
            id: 'color-input',
            className: 'border p-0.5 mr-1',
            containerClassName: 'flex gap-2',
            valueof: (item) => item.value,
            format: (item) => (
              <span style={{ color: item.value }}>{item.label}</span>
            ),
            keyof: (item) => item.label,
            options: [
              { label: 'Red', value: '#FF0000' },
              { label: 'Green', value: '#00FF00' },
              { label: 'Blue', value: '#0000FF' },
              { label: 'White', value: '#FFFFFF' },
            ],
            disabled: ['White'],
          })
        );
        display(<div>Colors: {JSON.stringify(pickedColors)}!</div>);
      }}
    </Reactlit>
  );
}
