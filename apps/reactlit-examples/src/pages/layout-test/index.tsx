import { Debug, useDebug } from '@/components/debug-toggle';
import {
  DataFetchingPlugin,
  LayoutView,
  useReactlit,
  useReactlitState,
} from '@reactlit/core';
import { Inputs, Label, RadixTheme } from '@reactlit/radix';

export default function Starter() {
  const [appState, setAppState] = useReactlitState<any>({
    name: '',
    weight: 'regular',
    size: 1,
  });
  const Reactlit = useReactlit(DataFetchingPlugin);
  const debug = useDebug();
  return (
    <RadixTheme>
      <Reactlit debug={debug} state={appState} setState={setAppState}>
        {async (ctx) => {
          const { view } = ctx;
          const [col1, col2] = view(
            'layout1',
            Debug,
            <div className="grid grid-cols-2 gap-4" />,
            LayoutView(2, <div />)
          );
          const v1 = col1.view(
            'leftInput',
            Debug,
            Label('Column Left'),
            Inputs.Text()
          );
          col1.display(Debug, v1);
          const v2 = col2.view(
            'rightInput',
            Debug,
            Label('Column Right'),
            Inputs.Text()
          );
          col2.display(Debug, v2);
        }}
      </Reactlit>
    </RadixTheme>
  );
}
