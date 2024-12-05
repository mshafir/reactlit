import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Reactlit',
      logo: { src: '/src/assets/reactlit.svg' },
      social: {
        github: 'https://github.com/mshafir/reactlit',
      },
      sidebar: [
        {
          label: 'Guides',
          items: [
            // Each item here is one entry in the navigation menu.
            { label: 'Getting Started', slug: 'guides/getting-started' },
            { label: 'Installation', slug: 'guides/installation' },
          ],
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'reference' },
        },
      ],
    }),
    react(),
  ],
});
