import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@solidjs/testing-library'
import { createEffect } from 'solid-js'

const { enableSpa, enableOutbound, enableFiles, pageview, createTakt } = vi.hoisted(() => {
  const enableSpa = vi.fn(() => vi.fn())
  const enableOutbound = vi.fn(() => vi.fn())
  const enableFiles = vi.fn(() => vi.fn())
  const pageview = vi.fn()
  const createTakt = vi.fn(() => ({ enableSpa, enableOutbound, enableFiles, pageview, track: vi.fn() }))
  return { enableSpa, enableOutbound, enableFiles, pageview, createTakt }
})

vi.mock('@vskstudio/takt-core', () => ({ createTakt }))

import { Takt } from '../src/Takt'
import { useTakt } from '../src/useTakt'
import { taktStore } from '../src/store'

beforeEach(() => {
  vi.clearAllMocks()
  taktStore.value = null
})

describe('<Takt>', () => {
  it('boots on mount: createTakt + spa + pageview, publishes to the store', () => {
    render(() => <Takt domain="example.com">child</Takt>)
    expect(createTakt).toHaveBeenCalledOnce()
    expect(enableSpa).toHaveBeenCalledOnce()
    expect(pageview).toHaveBeenCalledOnce()
    expect(taktStore.value).not.toBeNull()
  })

  it('honors feature toggles and disposes on unmount', () => {
    const disposeSpa = vi.fn()
    const disposeOutbound = vi.fn()
    enableSpa.mockReturnValueOnce(disposeSpa)
    enableOutbound.mockReturnValueOnce(disposeOutbound)
    const { unmount } = render(() => (
      <Takt outbound files={['pdf']}>
        x
      </Takt>
    ))
    expect(enableOutbound).toHaveBeenCalledOnce()
    expect(enableFiles).toHaveBeenCalledWith(['pdf'])
    expect(disposeSpa).not.toHaveBeenCalled()
    expect(disposeOutbound).not.toHaveBeenCalled()
    unmount()
    expect(disposeSpa).toHaveBeenCalledOnce()
    expect(disposeOutbound).toHaveBeenCalledOnce()
    expect(taktStore.value).toBeNull()
  })

  it('does not enable spa when spa={false}', () => {
    render(() => <Takt spa={false}>x</Takt>)
    expect(enableSpa).not.toHaveBeenCalled()
  })

  it('passes privacy defaults through to createTakt', () => {
    render(() => <Takt respectDnt={false}>x</Takt>)
    expect(createTakt).toHaveBeenCalledWith(
      expect.objectContaining({ respectDnt: false, excludeLocalhost: true }),
    )
  })

  it('provides the live instance via context to useTakt()', () => {
    const created = { enableSpa, enableOutbound, enableFiles, pageview, track: vi.fn() }
    createTakt.mockReturnValueOnce(created)
    let seen: unknown
    function Child() {
      // Context value is published in onMount; read it reactively so the test
      // observes the live instance once it arrives (not the pre-mount no-op).
      createEffect(() => {
        seen = useTakt()
      })
      return null
    }
    render(() => (
      <Takt>
        <Child />
      </Takt>
    ))
    expect(seen).toBe(created)
  })
})
