import { Reactlit, useReactlitState } from '@reactlit/core';
import { configureInputs } from '@reactlit/radix';
import { Main } from '../../components/main';

const Inputs = configureInputs();

export default function HelloWorld() {
  const [appState, setAppState] = useReactlitState({
    name: '',
  });
  return (
    <Main>
      <Reactlit state={appState} setState={setAppState}>
        {async ({ display, view }) => {
          display(<div className="text-2xl">Hello World</div>);
          const name = view(
            'name',
            Inputs.Text({
              label: 'Name',
              placeholder: 'Enter your name',
            })
          );
          if (!name) {
            throw new Error('Please enter your name');
          }
          display(<div>Hello {name}!</div>);
        }}
      </Reactlit>
    </Main>
  );
}
