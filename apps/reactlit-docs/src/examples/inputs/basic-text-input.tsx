import { defineView } from '@reactlit/core';

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
