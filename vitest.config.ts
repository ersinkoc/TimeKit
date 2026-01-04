import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'website'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        'website/',
        'examples/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types.ts',
      ],
      all: true,
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100,
    },
    ui: true,
  },
  resolve: {
    alias: {
      '@oxog/timekit': resolve(__dirname, './src/index.ts'),
      '@oxog/timekit/react': resolve(__dirname, './src/adapters/react/index.ts'),
    },
  },
})
