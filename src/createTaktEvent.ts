import { track as coreTrack } from '@vskstudio/takt-core'
import type { TrackOptions } from '@vskstudio/takt-core'
import { resolveTakt } from './store'

/**
 * Parameters for {@link createTaktEvent} / {@link TaktEvent}. Extends core's
 * `TrackOptions` (`props`, `revenue`) so the wire shape stays in sync, plus `name`.
 */
export interface TaktEventParams extends TrackOptions {
  /** The custom event name to track on click. */
  name: string
}

/**
 * Returns an `{ onClick }` to spread onto any element for declarative click
 * tracking. Reads `params` and resolves the active instance at click time, and
 * falls back to core's default instance for an `init()`-driven setup.
 */
export function createTaktEvent(params: TaktEventParams): { onClick: () => void } {
  const onClick = (): void => {
    const { name, props, revenue } = params
    const opts: TrackOptions = {}
    if (props) opts.props = props
    if (revenue) opts.revenue = revenue
    const final = Object.keys(opts).length ? opts : undefined
    const instance = resolveTakt()
    if (instance) instance.track(name, final)
    else coreTrack(name, final)
  }
  return { onClick }
}
