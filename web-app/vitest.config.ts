import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['server/**/*.test.ts'],
    // The server code uses .js import paths (Node ESM convention) — Vite handles
    // them via TS module resolution at test time.
    pool: 'forks',
  },
})
