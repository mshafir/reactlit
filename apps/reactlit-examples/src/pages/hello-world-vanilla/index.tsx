import { Reactlit, useReactlitState } from '@reactlit/core';
import { Inputs, Label } from '@reactlit/vanilla';

const LabelProps = { className: 'flex items-center gap-2 mb-2' };

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
        display(<div className="text-2xl mb-4">Hello World Vanilla</div>);

        const name = view(
          'name',
          Label('Name', LabelProps),
          Inputs.Text({
            id: 'name',
            className: 'border p-0.5',
            placeholder: 'Enter your name',
          })
        );

        display(<div>Hello {name}!</div>);

        const picked = view(
          'pickedNumbers',
          Label('Pick any number', LabelProps),
          Inputs.Check(['One', 'Two', 'Three'], {
            className: {
              wrapper: 'flex gap-2',
              item: {
                input: 'border p-0.5 mr-1',
              },
            },
          })
        );
        display(<div>Picked: {picked.join(', ')}!</div>);

        const pickedColors = view(
          'pickedColors',
          Label('Pick any color', LabelProps),
          Inputs.Check(
            [
              { label: 'Red', value: '#FF0000' },
              { label: 'Green', value: '#00FF00' },
              { label: 'Blue', value: '#0000FF' },
            ],
            {
              className: {
                wrapper: 'flex gap-2',
                item: {
                  input: 'border p-0.5 mr-1',
                },
              },
              valueof: (item) => item.value,
              format: (item) => (
                <span
                  style={{
                    color: item.value,
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
          Label('Choose a number', LabelProps),
          Inputs.Radio(['One', 'Two', 'Three'], {
            className: {
              wrapper: 'flex gap-2',
              item: {
                input: 'border p-0.5 mr-1',
              },
            },
          })
        );
        display(<div>Chosen Number: {chosenNumber}!</div>);

        const chosenColor = view(
          'chosenColor',
          Label('Choose a color', LabelProps),
          Inputs.Radio(
            [
              { label: 'Red', value: '#FF0000' },
              { label: 'Green', value: '#00FF00' },
              { label: 'Blue', value: '#0000FF' },
            ],
            {
              className: {
                wrapper: 'flex gap-2',
                item: {
                  input: 'border p-0.5 mr-1',
                },
              },
              valueof: (item) => item.value,
              format: (item) => (
                <span
                  style={{
                    color: item.value,
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
