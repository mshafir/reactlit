import { Reactlit, useReactlitState } from '@reactlit/core';
import { Inputs } from '@reactlit/vanilla';

export default function HelloWorldVanilla() {
  const [appState, setAppState] = useReactlitState({
    name: '',
    pickedNumbers: [],
    pickedColors: [],
    chosenNumber: '',
    chosenColor: '',
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
            className: {
              container: 'flex gap-2 items-center',
              wrapper: 'flex gap-2',
              item: {
                input: 'border p-0.5 mr-1',
              },
            },
            label: 'Pick any number',
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
              className: {
                container: 'flex gap-2 items-center',
                wrapper: 'flex gap-2',
                item: {
                  input: 'border p-0.5 mr-1',
                },
              },
              label: 'Pick any color',
              valueof: (item) => item.value,
              format: (item) => (
                <span
                  style={{
                    color: item.value,
                    backgroundColor: '#aaa',
                    padding: '0rem 0.5rem',
                    borderRadius: '0.2rem',
                  }}
                >
                  {item.label}
                </span>
              ),
              disabled: (item) => item.value === '#FFFFFF',
            }
          )
        );
        display(<div>Colors: {JSON.stringify(pickedColors)}!</div>);
        const chosenNumber = view(
          'chosenNumber',
          Inputs.Radio(['One', 'Two', 'Three'], {
            className: {
              container: 'flex gap-2 items-center',
              wrapper: 'flex gap-2',
              item: {
                input: 'border p-0.5 mr-1',
              },
            },
            label: 'Choose a number',
          })
        );
        display(<div>Chosen Number: {chosenNumber}!</div>);
        const chosenColor = view(
          'chosenColor',
          Inputs.Radio(
            [
              { label: 'Red', value: '#FF0000' },
              { label: 'Green', value: '#00FF00' },
              { label: 'Blue', value: '#0000FF' },
              { label: 'White', value: '#FFFFFF' },
            ],
            {
              className: {
                container: 'flex gap-2 items-center',
                wrapper: 'flex gap-2',
                item: {
                  input: 'border p-0.5 mr-1',
                },
              },
              label: 'Choose a color',
              valueof: (item) => item.value,
              format: (item) => (
                <span
                  style={{
                    color: item.value,
                    backgroundColor: '#aaa',
                    padding: '0rem 0.5rem',
                    borderRadius: '0.2rem',
                  }}
                >
                  {item.label}
                </span>
              ),
              disabled: (item) => item.value === '#FFFFFF',
            }
          )
        );
        display(<div>Chosen Color: {JSON.stringify(chosenColor)}!</div>);
      }}
    </Reactlit>
  );
}
