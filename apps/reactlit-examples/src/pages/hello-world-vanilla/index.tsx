import { Reactlit, useReactlitState } from '@reactlit/core';
import { Inputs } from '@reactlit/vanilla';

export default function HelloWorldVanilla() {
  const [appState, setAppState] = useReactlitState({
    name: '',
    pickedNumbers: [],
    pickedColors: [],
    choosedNumber: '',
    choosedColor: '',
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
        const choosedNumber = view(
          'choosedNumber',
          Inputs.Radio(['One', 'Two', 'Three'], {
            className: 'border p-0.5 mr-1',
            label: 'Choose a number',
            containerClassName: 'flex gap-2',
          })
        );
        display(<div>Choosed Number: {choosedNumber}!</div>);
        const choosedColor = view(
          'choosedColor',
          Inputs.Radio(
            [
              { label: 'Red', value: '#FF0000' },
              { label: 'Green', value: '#00FF00' },
              { label: 'Blue', value: '#0000FF' },
              { label: 'White', value: '#FFFFFF' },
            ],
            {
              className: 'border p-0.5 mr-1',
              label: 'Choose a color',
              containerClassName: 'flex gap-2',
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
        display(<div>Color: {JSON.stringify(choosedColor)}!</div>);
      }}
    </Reactlit>
  );
}
