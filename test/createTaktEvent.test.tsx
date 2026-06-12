import { describe, it, expect, vi, beforeEach } from 'vitest'

const { coreTrack } = vi.hoisted(() => ({ coreTrack: vi.fn() }))
vi.mock('@vskstudio/takt-core', () => ({ track: coreTrack }))

import { createTaktEvent } from '../src/createTaktEvent'
import { taktStore } from '../src/store'
import type { TaktInstance } from '../src/noop'

beforeEach(() => {
  vi.clearAllMocks()
  taktStore.value = null
})

describe('createTaktEvent', () => {
  it('routes through the resolved instance when present', () => {
    const track = vi.fn()
    taktStore.value = { track } as unknown as TaktInstance
    const { onClick } = createTaktEvent({ name: 'Signup', props: { plan: 'pro' } })
    onClick()
    expect(track).toHaveBeenCalledWith('Signup', { props: { plan: 'pro' } })
    expect(coreTrack).not.toHaveBeenCalled()
  })

  it('falls back to core track when no instance', () => {
    const { onClick } = createTaktEvent({ name: 'Buy', revenue: { amount: '9', currency: 'EUR' } })
    onClick()
    expect(coreTrack).toHaveBeenCalledWith('Buy', { revenue: { amount: '9', currency: 'EUR' } })
  })

  it('resolves the instance at click time, not at creation time', () => {
    const { onClick } = createTaktEvent({ name: 'Late' })
    const track = vi.fn()
    taktStore.value = { track } as unknown as TaktInstance
    onClick()
    expect(track).toHaveBeenCalledWith('Late', undefined)
    expect(coreTrack).not.toHaveBeenCalled()
  })

  it('reads fresh params on each click (no stale capture)', () => {
    const track = vi.fn()
    taktStore.value = { track } as unknown as TaktInstance
    const params = { name: 'A' as string, props: undefined as undefined | Record<string, string> }
    const { onClick } = createTaktEvent(params)
    onClick()
    params.name = 'B'
    params.props = { k: 'v' }
    onClick()
    expect(track).toHaveBeenNthCalledWith(1, 'A', undefined)
    expect(track).toHaveBeenNthCalledWith(2, 'B', { props: { k: 'v' } })
  })

  it('passes undefined opts when neither props nor revenue set', () => {
    const track = vi.fn()
    taktStore.value = { track } as unknown as TaktInstance
    const { onClick } = createTaktEvent({ name: 'Plain' })
    onClick()
    expect(track).toHaveBeenCalledWith('Plain', undefined)
  })
})
