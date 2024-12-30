import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { defineView, Reactlit } from '.';

export const TextInput = defineView<string>(({ value, setValue, stateKey }) => (
  <input
    id={stateKey}
    value={value ?? ''}
    autoComplete="off"
    spellCheck={false}
    onChange={(e) => setValue(e.target.value)}
    placeholder={`Enter ${stateKey}`}
  />
));

test('hello world reactlit', async () => {
  render(
    <Reactlit>
      {async ({ display, view }) => {
        const name = view('name', TextInput);
        if (!name) {
          throw new Error('Name is required');
        }
        display(<div>Hello {name}</div>);
      }}
    </Reactlit>
  );
  expect(await screen.findByText('Name is required')).toBeVisible();
  await userEvent.type(screen.getByPlaceholderText('Enter name'), 'World');
  expect(await screen.findByText('Hello World')).toBeVisible();
});
