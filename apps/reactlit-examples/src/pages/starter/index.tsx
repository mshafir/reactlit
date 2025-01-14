import { Box, Text } from '@radix-ui/themes';
import { textPropDefs } from '@radix-ui/themes/props';
import {
  DataFetchingPlugin,
  useReactlit,
  useReactlitState,
  LayoutView,
  Wrapper,
} from '@reactlit/core';
import { DefaultRadixWrapper, Inputs } from '@reactlit/radix';

const TwoColWrapper: Wrapper = ({ children }) => (
  <div className="grid grid-cols-2 gap-4">{children}</div>
);

export default function Starter() {
  const [appState, setAppState] = useReactlitState<any>({
    name: '',
    weight: 'regular',
    size: 1,
  });
  const Reactlit = useReactlit(DataFetchingPlugin);
  return (
    <Reactlit
      debug
      state={appState}
      setState={setAppState}
      wrapper={DefaultRadixWrapper}
    >
      {async (ctx) => {
        const { display, view } = ctx;
        const name = view(
          'name',
          Inputs.Text({
            label: 'What is your name?',
            placeholder: 'Enter name',
          })
        );
        const weight = view(
          'weight',
          Inputs.Radio(['light', 'regular', 'medium', 'bold'] as const, {
            label: 'Weight',
          })
        );
        const size = view(
          'size',
          Inputs.Slider({
            label: 'Size',
            min: 1,
            max: 9,
          })
        );

        display(
          <Box py={'4'}>
            <hr />
          </Box>
        );
        display(
          <Box py={'2'}>
            <Text
              weight={weight}
              size={`${size}` as (typeof textPropDefs.size.values)[number]}
            >
              Hello to {name ? name : <Text color="red">Enter Name</Text>} from
              Reactlit!
            </Text>
          </Box>
        );

        if (view('show', Inputs.Radio(['show', 'hide'] as const)) === 'show') {
          const [col1, col2] = view('l1', TwoColWrapper, LayoutView(2));
          const v1 = view(
            'leftInput',
            col1,
            Inputs.Text({ label: 'Column Left' })
          );
          display(col1, v1);
          view('rightInput', col2, Inputs.Text({ label: 'Column Right' }));
        }

        display('Separator');
        const [col1B, col2B] = view('l2', TwoColWrapper, LayoutView(2));
        view('c1B', col1B, Inputs.Text({ label: 'Column 1 B' }));
        view('c2B', col2B, Inputs.Text({ label: 'Column 2 B' }));
      }}
    </Reactlit>
  );
}
