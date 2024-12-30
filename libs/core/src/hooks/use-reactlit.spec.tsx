import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { useReactlit } from './use-reactlit';
import { LayoutPlugin, makeLayoutPlugin } from '../plugins/layout';
import { useReactlitState } from './use-reactlit-state';
import { defineLayout } from '../plugins/layout';
import { TextInput } from '../reactlit.spec';

export const TwoColumnLayout = defineLayout(2, ({ slots: [Slot1, Slot2] }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
    <div>
      <Slot1 />
    </div>
    <div>
      <Slot2 />
    </div>
  </div>
));

test('reactlit plugin', async () => {
  function PluginTest() {
    const [state, setState] = useReactlitState({
      firstName: 'John',
      lastName: 'Doe',
    });
    const Reactlit = useReactlit(LayoutPlugin<typeof state>);
    return (
      <Reactlit state={state} setState={setState}>
        {async (ctx) => {
          const [col1, col2] = ctx.layout(TwoColumnLayout);
          col1.view('firstName', TextInput);
          col1.display(`First Name: ${state.firstName}`);
          col2.display(`Last Name: ${state.lastName}`);
        }}
      </Reactlit>
    );
  }
  render(<PluginTest />);
  expect(await screen.findByText('First Name: John')).toBeVisible();
  await userEvent.clear(screen.getByPlaceholderText('Enter firstName'));
  await userEvent.type(
    screen.getByPlaceholderText('Enter firstName'),
    'Joseph'
  );
  expect(await screen.findByText('First Name: Joseph')).toBeVisible();
  expect(await screen.findByText('Last Name: Doe')).toBeVisible();
});
