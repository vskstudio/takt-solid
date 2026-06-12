import { createSignal, onCleanup, onMount, type JSX } from 'solid-js'
import { isServer } from 'solid-js/web'
import { createTakt } from '@vskstudio/takt-core'
import { TaktContext, taktStore, type TaktInstance } from './store'

export interface TaktProps {
  /** Site identifier sent with every event. Defaults to `location.hostname`. */
  domain?: string
  /** Ingestion endpoint. Defaults to `/api/event`. */
  endpoint?: string
  /** Auto-track outbound link clicks. */
  outbound?: boolean
  /** Auto-track file downloads. Pass an array to restrict to those extensions. */
  files?: boolean | string[]
  /** Track SPA navigations (history pushState/replaceState + popstate). */
  spa?: boolean
  /** Suppress events when the browser's Do Not Track is enabled. */
  respectDnt?: boolean
  /** Suppress events on localhost and private IP ranges. */
  excludeLocalhost?: boolean
  children?: JSX.Element
}

export function Takt(props: TaktProps): JSX.Element {
  const [instance, setInstance] = createSignal<TaktInstance | null>(null)

  onMount(() => {
    // Never boot on the server: createTakt touches location/window.
    if (isServer) return
    const takt = createTakt({
      domain: props.domain,
      endpoint: props.endpoint,
      respectDnt: props.respectDnt ?? true,
      excludeLocalhost: props.excludeLocalhost ?? true,
    })
    const disposers: Array<() => void> = []
    if (props.spa ?? true) disposers.push(takt.enableSpa())
    if (props.outbound) disposers.push(takt.enableOutbound())
    if (props.files) disposers.push(takt.enableFiles(Array.isArray(props.files) ? props.files : undefined))
    takt.pageview()

    setInstance(takt)
    taktStore.value = takt

    onCleanup(() => {
      disposers.forEach((dispose) => dispose())
      setInstance(null)
      taktStore.value = null
    })
  })

  return <TaktContext.Provider value={instance()}>{props.children}</TaktContext.Provider>
}
