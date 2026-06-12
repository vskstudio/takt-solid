import { defineConfig } from 'vitest/config'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  resolve: {
    // Ensure the browser (client) build of Solid is used in the jsdom env.
    conditions: ['development', 'browser'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    // Unit tests live in test/; e2e/*.spec.ts belongs to Playwright.
    include: ['test/**/*.test.{ts,tsx}'],
    setupFiles: ['./test/setup.ts'],
    // The SSR file pins its own `// @vitest-environment node` and needs the
    // server build of solid-js, which the default plugin transform provides.
    server: { deps: { inline: [/solid-js/, /@solidjs\/testing-library/] } },
  },
})
