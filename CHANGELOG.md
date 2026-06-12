# @vskstudio/takt-solid

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
