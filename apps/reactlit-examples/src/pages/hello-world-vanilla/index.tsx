import {
  LayoutView,
  Reactlit,
  useReactlitState,
  Wrapper,
} from '@reactlit/core';
import { Inputs } from '@reactlit/vanilla';

const InputWrapper: Wrapper = ({ children }) => {
  return <div className="flex flex-col gap-2">{children}</div>;
};

export default function HelloWorldVanilla() {
  const [appState, setAppState] = useReactlitState<any>({
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

        const [labelElement, inputElement] = view(
          'nameWrapper',
          <div className="flex items-center gap-2" />,
          LayoutView(2)
        );

        labelElement.display(<label htmlFor="name-input">Name:</label>);

        const name = inputElement.view(
          'name',
          Inputs.Text({
            id: 'name-input',
            className: 'border p-0.5',
            placeholder: 'Enter your name',
          })
        );

        display(<div>Hello {name}!</div>);

        const [checkLabelElement, checkElement] = view(
          'pickedNumbersWrapper',
          <div className="flex items-center gap-2" />,
          LayoutView(2)
        );

        checkLabelElement.display(
          <label htmlFor="picked-numbers-input">Pick any number:</label>
        );
        const picked = checkElement.view(
          'pickedNumbers',
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

        const [pickedColorsLabelElement, pickedColorsElement] = view(
          'pickedColorsWrapper',
          <div className="flex items-center gap-2" />,
          LayoutView(2)
        );
        pickedColorsLabelElement.display(
          <label htmlFor="picked-colors-input">Pick any color:</label>
        );
        const pickedColors = pickedColorsElement.view(
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

        const [chosenNumberLabelElement, chosenNumberElement] = view(
          'chosenNumberWrapper',
          <div className="flex items-center gap-2" />,
          LayoutView(2)
        );
        chosenNumberLabelElement.display(
          <label htmlFor="chosen-number-input">Choose a number:</label>
        );
        const chosenNumber = chosenNumberElement.view(
          'chosenNumber',
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

        const [chosenColorLabelElement, chosenColorElement] = view(
          'chosenColorWrapper',
          <div className="flex items-center gap-2" />,
          LayoutView(2)
        );
        chosenColorLabelElement.display(
          <label htmlFor="chosen-color-input">Choose a color:</label>
        );
        const chosenColor = chosenColorElement.view(
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
