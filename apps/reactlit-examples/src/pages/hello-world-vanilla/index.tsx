import { Reactlit, useReactlitState, Wrapper } from '@reactlit/core';
import { Inputs } from '@reactlit/vanilla';
import { useMemo } from 'react';

const InputLabelWrapper =
  (label: string): Wrapper =>
  ({ children }) => {
    return (
      <div className="flex items-center gap-2 mb-2">
        <label>{label}</label>
        <div className="flex-auto">{children}</div>
      </div>
    );
  };

export default function HelloWorldVanilla() {
  const [appState, setAppState] = useReactlitState<any>({
    name: '',
    pickedNumbers: [],
    pickedColors: [],
    chosenNumber: '',
    chosenColor: '',
  });

  const inputLabel = useMemo(() => {
    return InputLabelWrapper('Name');
  }, []);

  const checkboxNumberLabel = useMemo(() => {
    return InputLabelWrapper('Pick any number');
  }, []);

  const checkboxColorLabel = useMemo(() => {
    return InputLabelWrapper('Pick any color');
  }, []);

  const radioNumberLabel = useMemo(() => {
    return InputLabelWrapper('Choose a number');
  }, []);

  const radioColorLabel = useMemo(() => {
    return InputLabelWrapper('Choose a color');
  }, []);

  return (
    <Reactlit state={appState} setState={setAppState}>
      {async ({ display, view }) => {
        display(<div className="text-2xl mb-4">Hello World Vanilla</div>);

        const name = view(
          'name',
          inputLabel,
          Inputs.Text({
            id: 'name',
            className: 'border p-0.5',
            placeholder: 'Enter your name',
          })
        );

        display(<div>Hello {name}!</div>);

        const picked = view(
          'pickedNumbers',
          checkboxNumberLabel,
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
          checkboxColorLabel,
          Inputs.Check(
            [
              { label: 'Red', value: '#FF0000' },
              { label: 'Green', value: '#00FF00' },
              { label: 'Blue', value: '#0000FF' },
              { label: 'White', value: '#FFFFFF' },
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
          radioNumberLabel,
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
          radioColorLabel,
          Inputs.Radio(
            [
              { label: 'Red', value: '#FF0000' },
              { label: 'Green', value: '#00FF00' },
              { label: 'Blue', value: '#0000FF' },
              { label: 'White', value: '#FFFFFF' },
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
