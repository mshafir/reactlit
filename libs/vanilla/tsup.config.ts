import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  treeshake: true,
  sourcemap: 'inline',
  minify: true,
  clean: false,
  dts: true,
  splitting: false,
  format: ['cjs', 'esm'],
  external: ['react'],
});
