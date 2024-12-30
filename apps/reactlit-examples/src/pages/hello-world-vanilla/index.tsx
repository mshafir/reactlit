import { Reactlit, useReactlitState } from '@reactlit/core';
import { Inputs } from '@reactlit/vanilla';

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
          Inputs.Check(['One', 'Two', 'Three'], {
            className: 'border p-0.5 mr-1',
            label: 'Pick any number',
            containerClassName: 'flex gap-2',
          })
        );
        display(<div>Picked: {picked.join(', ')}!</div>);
        const pickedColors = view(
          'pickedColors',
          Inputs.Check(
            [
              { label: 'Red', value: '#FF0000' },
              { label: 'Green', value: '#00FF00' },
              { label: 'Blue', value: '#0000FF' },
              { label: 'White', value: '#FFFFFF' },
            ],
            {
              className: 'border p-0.5 mr-1',
              label: 'Pick any color',
              containerClassName: 'flex gap-2',
              valueof: (item) => item.value,
              format: (item) => (
                <span style={{ color: item.value }}>{item.label}</span>
              ),
              keyof: (item) => item.label,
              disabled: ['White'],
            }
          )
        );
        display(<div>Colors: {JSON.stringify(pickedColors)}!</div>);
      }}
    </Reactlit>
  );
}
