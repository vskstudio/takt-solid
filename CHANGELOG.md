# @vskstudio/takt-solid

## 0.5.1

### Patch Changes

- Require takt-core >=0.6.0, whose default ingest endpoint and stats/widget host are now the hosted Takt origin (https://taktlytics.com). Docs updated to match; no wrapper code change.

## 0.5.0

### Minor Changes

- ff9a047: Expose advanced tracker options: enabled, sampleRate, trackQuery, queryParams,
  scrubUrl (function prop / config only) and tagged. Peer dep raised to takt-core >=0.5.0.

## 0.3.1

### Patch Changes

- Harden widgets: `Omit` the wrapper-controlled `src` from the badge/embed prop types, add `decoding="async"` to the badge for parity, keep `src` rendered after the prop spread so a consumer `src` cannot override the built URL, and add a default `referrerpolicy="strict-origin-when-cross-origin"` to `<TaktEmbed>` (overridable). Document that `host` must be an absolute http(s) URL.

## 0.3.0

### Minor Changes

- Add native `TaktBadge` and `TaktEmbed` widget components and re-export the public stats client (`createStats`) and widget URL builders from `@vskstudio/takt-core`. Requires `@vskstudio/takt-core` >= 0.3.0.

## 0.2.0

### Minor Changes

- Initial release: idiomatic SolidJS wrapper for Takt analytics.
  - `<Takt>` provider component (SSR-safe boot in `onMount`, guarded by `isServer`).
  - `useTakt()` accessor with a never-throwing no-op fallback.
  - `createTaktEvent()` and `<TaktEvent>` for declarative click tracking, resolving
    the active instance (and reading `props`/`revenue`) at click time, with a core
    `track` fallback for `init()`-driven setups.
  - Framework-agnostic `<takt-analytics>` custom element via `./element`.
  - Aligned with `@vskstudio/takt-core` 0.2 (`props` and `revenue` flow through).
