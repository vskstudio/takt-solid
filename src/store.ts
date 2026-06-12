import { createContext, useContext } from 'solid-js'
import type { TaktInstance } from './noop'

export type { TaktInstance }

// Context is the in-tree channel; the module store is the out-of-tree fallback
// so createTaktEvent handlers and non-provider callers still resolve an instance.
export const TaktContext = createContext<TaktInstance | null>(null)

export const taktStore: { value: TaktInstance | null } = { value: null }

// Component-scoped form — must be called under <Takt>. Prefers the context instance.
export function useResolveTakt(): TaktInstance | null {
  return useContext(TaktContext) ?? taktStore.value
}

// Non-reactive form — safe to call at click time / outside the component tree.
export function resolveTakt(): TaktInstance | null {
  return taktStore.value
}
