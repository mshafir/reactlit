import { LayoutPlugin, Reactlit } from '@reactlit/core';
import { TextInput } from './inputs/basic-text-input';
import { ThreeColumnLayout } from './layouts/three-column-layout';

export default function LayoutExample() {
  return (
    <Reactlit plugins={[LayoutPlugin] as const}>
      {async ({ layout }) => {
        const [col1, col2, col3] = layout(ThreeColumnLayout);

        col1.display('First Name');
        const first = col1.view('first', TextInput);

        col2.display('Last Name');
        const last = col2.view('last', TextInput);

        col3.display('Hello to');
        col3.display(
          <div>
            {first} {last}
          </div>
        );
      }}
    </Reactlit>
  );
}
