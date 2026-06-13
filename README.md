<div align="center">

# @vskstudio/takt-solid

**Idiomatic SolidJS wrapper for [Takt](https://github.com/vskstudio/takt-core) privacy-friendly analytics.**

[![npm version](https://img.shields.io/npm/v/@vskstudio/takt-solid?color=2c4f7c&logo=npm)](https://www.npmjs.com/package/@vskstudio/takt-solid)
[![solid 1.8+](https://img.shields.io/badge/solid-1.8%2B-2c4f7c?logo=solid&logoColor=fff)](https://www.solidjs.com)
[![license](https://img.shields.io/npm/l/@vskstudio/takt-solid?color=2c4f7c)](./LICENSE)

</div>

---

A thin, SSR-safe Solid layer over [`@vskstudio/takt-core`](https://www.npmjs.com/package/@vskstudio/takt-core). It never changes the wire payload or the privacy guarantees — it just makes Takt feel native in a Solid app.

- **`<Takt>` component** — drop it once near the root; it boots analytics in `onMount` and provides the instance to the tree.
- **`useTakt()`** — grab the live instance anywhere; returns a never-throwing no-op before mount or during SSR.
- **`createTaktEvent()` & `<TaktEvent>`** — declarative click tracking.
- **`<takt-analytics>` custom element** — framework-agnostic, Solid-free embed for non-Solid pages.

## Install

```bash
pnpm add @vskstudio/takt-solid @vskstudio/takt-core
```

`solid-js` (`^1.8`) and `@vskstudio/takt-core` are peer dependencies.

## Quick start — provider + accessor

Mount `<Takt>` once near your root. It fires an initial pageview, wires SPA navigation, and provides the instance to every descendant:

```tsx
import { Takt } from '@vskstudio/takt-solid'

export function App() {
  return (
    <Takt domain="example.com" outbound files={['pdf', 'zip']}>
      <Routes />
    </Takt>
  )
}
```

Then track custom events from any descendant:

```tsx
import { useTakt } from '@vskstudio/takt-solid'

export function SignupButton() {
  const takt = useTakt()
  return (
    <button
      onClick={() =>
        takt.track('Signup', {
          props: { plan: 'pro' },
          revenue: { amount: '29.00', currency: 'EUR' },
        })
      }
    >
      Sign up
    </button>
  )
}
```

`useTakt()` always returns a usable instance: before `<Takt>` mounts (or during SSR) it hands back a never-throwing no-op, so your handlers never crash.

## `<Takt>` props

| Prop               | Type                  | Default              | Description                                                     |
| ------------------ | --------------------- | -------------------- | -------------------------------------------------------------- |
| `domain`           | `string`              | `location.hostname`  | Site identifier sent with every event.                         |
| `endpoint`         | `string`              | `/api/event`         | Ingestion endpoint.                                            |
| `outbound`         | `boolean`             | `false`              | Auto-track outbound link clicks.                               |
| `files`            | `boolean \| string[]` | `false`              | Auto-track file downloads; pass extensions to restrict.        |
| `spa`              | `boolean`             | `true`               | Track SPA navigations (pushState/replaceState + popstate).     |
| `respectDnt`       | `boolean`             | `true`               | Suppress events when the browser's Do Not Track is enabled.    |
| `excludeLocalhost` | `boolean`             | `true`               | Suppress events on localhost and private IP ranges.            |

> Config props are read once when `<Takt>` mounts. Changing them afterwards has no effect — remount the component to reconfigure.

## Declarative click tracking

Two equivalent ways to track a click without writing a handler.

**`createTaktEvent()`** returns an `{ onClick }` you spread onto any element:

```tsx
import { createTaktEvent } from '@vskstudio/takt-solid'

export function BuyButton() {
  const onBuy = createTaktEvent({ name: 'Buy', revenue: { amount: '9.00', currency: 'EUR' } })
  return <button {...onBuy}>Buy</button>
}
```

**`<TaktEvent>`** wraps a single child and composes its existing `onClick`:

```tsx
import { TaktEvent } from '@vskstudio/takt-solid'

export function SignupCta(props: { onClick: () => void }) {
  return (
    <TaktEvent name="Signup" props={{ plan: 'pro' }}>
      <button onClick={props.onClick}>Sign up</button>
    </TaktEvent>
  )
}
```

Both resolve the active instance at click time, so they work inside `<Takt>` or with an `init()`-driven core setup, falling back to core's default instance otherwise.

## Custom element (Solid-free)

For non-Solid pages, import the side-effecting `./element` entry to register `<takt-analytics>`. It bundles core and pulls in **no Solid runtime**:

```ts
import '@vskstudio/takt-solid/element'
```

```html
<takt-analytics domain="example.com" outbound files></takt-analytics>
```

Privacy attributes (`respect-dnt`, `exclude-localhost`, `spa`) are on by default and only disabled by an explicit `"false"`/`"0"`. Presence flags (`outbound`, `files`) activate when the attribute is present.

## SSR

`<Takt>` boots inside `onMount` and is guarded by Solid's `isServer`, so nothing touches `window`/`document` on the server. `useTakt()` returns the no-op during the server pass. Importing `@vskstudio/takt-solid/element` on the server is a no-op — registration is guarded behind a `customElements` check.

## Privacy

All privacy behavior lives in [`@vskstudio/takt-core`](https://www.npmjs.com/package/@vskstudio/takt-core): Do Not Track support, localhost exclusion, opt-in/opt-out consent, and a frozen wire payload. This wrapper never alters any of it.

## Widgets

Thin wrappers over the server-rendered badge SVG and embed page. `<TaktBadge>` renders an `<img>`, `<TaktEmbed>` an `<iframe>`; both accept native passthrough props.

```tsx
import { TaktBadge, TaktEmbed } from '@vskstudio/takt-solid'

;<TaktBadge domain="example.com" variant="d" glyph="dash" />
;<TaktEmbed domain="example.com" theme="dark" />
```

The optional `host` prop must be an absolute `http(s)` URL (validated by core); `src` is wrapper-controlled and cannot be overridden.

For programmatic stats, `createStats` returns a typed public-API client:

```ts
import { createStats } from '@vskstudio/takt-solid'

const stats = createStats({ domain: 'example.com' })
const summary = await stats.summary({ period: '7d' })
```

## License

[MIT](./LICENSE)
