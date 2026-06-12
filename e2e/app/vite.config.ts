import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import { resolve } from 'node:path'

// Resolve the package to its built output so the e2e exercises the real
// published artifact (JSX preserved in dist/index.jsx, compiled by the plugin).
export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      '@vskstudio/takt-solid': resolve(__dirname, '../../dist/index.jsx'),
    },
  },
})
