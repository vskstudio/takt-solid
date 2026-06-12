import { defineConfig } from 'tsup'
import { solidPlugin } from 'esbuild-plugin-solid'

const external = ['solid-js', 'solid-js/web', 'solid-js/store', '@vskstudio/takt-core']

export default defineConfig([
  // Main entry: Solid JSX pre-compiled to the runtime; solid-js + core external.
  {
    entry: { index: 'src/index.ts' },
    format: ['esm'],
    dts: true,
    clean: true,
    external,
    esbuildPlugins: [solidPlugin({ solid: { generate: 'dom' } })],
  },
  // "solid" export condition: ship JSX un-compiled so SSR/hydration consumers
  // compile it with their own Solid generate target.
  {
    entry: { index: 'src/index.ts' },
    outExtension: () => ({ js: '.jsx' }),
    format: ['esm'],
    dts: false,
    clean: false,
    external,
    esbuildOptions(opts) {
      opts.jsx = 'preserve'
    },
  },
  {
    // Self-contained custom element for CDN use: core is bundled, no Solid runtime.
    entry: { 'element/index': 'src/element/index.ts' },
    format: ['esm'],
    dts: true,
    clean: false,
    noExternal: ['@vskstudio/takt-core'],
  },
])
