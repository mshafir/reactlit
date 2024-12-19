import { Reactlit, useReactlitState } from '@reactlit/core';
import { configureInputs } from '@reactlit/vanilla';

const Inputs = configureInputs();

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
          Inputs.Text({
            id: 'name-input',
            className: 'border p-0.5',
            label: 'Name',
            placeholder: 'Enter your name',
          })
        );
        display(<div>Hello {name}!</div>);
        const picked = view(
          'pickedNumbers',
          Inputs.Check({
            id: 'number-input',
            className: 'border p-0.5 mr-1',
            label: 'Pick any number',
            containerClassName: 'flex gap-2',
            options: ['One', 'Two', 'Three'],
          })
        );
        display(<div>Picked: {picked.join(', ')}!</div>);
        const pickedColors = view(
          'pickedColors',
          Inputs.Check({
            id: 'color-input',
            className: 'border p-0.5 mr-1',
            label: 'Pick any color',
            containerClassName: 'flex gap-2',
            valueof: (item: any) => item.value,
            format: (item: any) => (
              <span style={{ color: item.value }}>{item.label}</span>
            ),
            keyof: (item: any) => item.label,
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
