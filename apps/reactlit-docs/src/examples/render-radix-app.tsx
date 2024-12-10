import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import { Reactlit, type ReactlitFunction } from '@reactlit/core';

export default function RenderRadixApp({ app }: { app: ReactlitFunction }) {
  return (
    <div style={{ position: 'relative' }}>
      <Theme className="not-content" data-is-root-theme={false}>
        <Reactlit>{app}</Reactlit>
      </Theme>
    </div>
  );
}
