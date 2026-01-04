import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/adapters/react/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  minify: true,
  target: 'es2020',
  outDir: 'dist',
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.outbase = 'src'
  },
})
