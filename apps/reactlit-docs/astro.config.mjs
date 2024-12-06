import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  vite: {
    ssr: {
      noExternal: ['@radix-ui/themes'],
    },
  },
  integrations: [
    starlight({
      title: 'Reactlit',
      logo: { src: '/src/assets/reactlit.svg' },
      customCss: ['/src/styles/app.css'],
      social: {
        github: 'https://github.com/mshafir/reactlit',
      },
      expressiveCode: {
        styleOverrides: {
          codeFontSize: '12px',
        },
      },
      sidebar: [
        {
          label: 'Guides',
          items: [
            // Each item here is one entry in the navigation menu.
            { label: 'Getting Started', slug: 'guides/getting-started' },
            { label: 'Installation', slug: 'guides/installation' },
            { label: 'Basics', slug: 'guides/basics' },
            { label: 'Defining Views', slug: 'guides/defining-views' },
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
