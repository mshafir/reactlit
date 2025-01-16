import { Box, Text } from '@radix-ui/themes';
import { textPropDefs } from '@radix-ui/themes/props';
import {
  DataFetchingPlugin,
  LayoutView,
  useReactlit,
  useReactlitState,
  Wrapper,
} from '@reactlit/core';
import { Inputs, RadixTheme } from '@reactlit/radix';

const StarterWrapper: Wrapper = ({ children, stateKey }) => {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-2 items-center border rounded-md mb-2 overflow-hidden">
      <div className="min-w-16 p-2 h-full border-r text-xs">{stateKey}</div>
      <div className="flex-auto p-2">{children}</div>
    </div>
  );
};

export default function Starter() {
  const [appState, setAppState] = useReactlitState<any>({
    name: '',
    weight: 'regular',
    size: 1,
  });
  const Reactlit = useReactlit(DataFetchingPlugin);
  return (
    <RadixTheme>
      <Reactlit
        debug
        state={appState}
        setState={setAppState}
        wrapper={StarterWrapper}
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
            StarterWrapper,
            <Box py={'2'} />,
            <Text
              weight={weight}
              size={`${size}` as (typeof textPropDefs.size.values)[number]}
            >
              Hello to {name ? name : <Text color="red">Enter Name</Text>} from
              Reactlit!
            </Text>
          );

          const [col1, col2] = view(
            'l1',
            <div className="grid grid-cols-2 gap-4" />,
            LayoutView(2)
          );
          const v1 = col1.view(
            'leftInput',
            Inputs.Text({ label: 'Column Left' })
          );
          col1.display(v1);
          const v2 = col2.view(
            'rightInput',
            Inputs.Text({ label: 'Column Right' })
          );
          col2.display(v2);
        }}
      </Reactlit>
    </RadixTheme>
  );
}
