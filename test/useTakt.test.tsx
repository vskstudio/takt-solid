import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@solidjs/testing-library'
import { useTakt } from '../src/useTakt'
import { taktStore } from '../src/store'
import type { TaktInstance } from '../src/noop'

beforeEach(() => {
  taktStore.value = null
})

describe('useTakt', () => {
  it('returns a never-throwing no-op when no instance exists', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { result } = renderHook(() => useTakt())
    expect(() => result.track('X')).not.toThrow()
  })

  it('resolves the module store instance outside a provider', () => {
    const track = vi.fn()
    taktStore.value = { track } as unknown as TaktInstance
    const { result } = renderHook(() => useTakt())
    result.track('Y')
    expect(track).toHaveBeenCalledWith('Y')
    taktStore.value = null
  })
})
