import { Reactlit } from '@reactlit/core';
import { TextInput } from './inputs/basic-text-input';

export default function HelloWorld() {
  return (
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
}
