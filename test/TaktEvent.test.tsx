import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent } from '@solidjs/testing-library'

vi.mock('@vskstudio/takt-core', () => ({ track: vi.fn() }))

import { TaktEvent } from '../src/TaktEvent'
import { taktStore } from '../src/store'
import type { TaktInstance } from '../src/noop'

beforeEach(() => {
  vi.clearAllMocks()
  taktStore.value = null
})

describe('<TaktEvent>', () => {
  it('tracks on click via the resolved instance', () => {
    const track = vi.fn()
    taktStore.value = { track } as unknown as TaktInstance
    const { getByText } = render(() => (
      <TaktEvent name="Signup">
        <button>Go</button>
      </TaktEvent>
    ))
    fireEvent.click(getByText('Go'))
    expect(track).toHaveBeenCalledWith('Signup', undefined)
  })

  it('composes the child existing onClick', () => {
    const track = vi.fn()
    taktStore.value = { track } as unknown as TaktInstance
    const childClick = vi.fn()
    const { getByText } = render(() => (
      <TaktEvent name="X">
        <button onClick={childClick}>Go</button>
      </TaktEvent>
    ))
    fireEvent.click(getByText('Go'))
    expect(childClick).toHaveBeenCalledOnce()
    expect(track).toHaveBeenCalledOnce()
  })

  it('forwards props through to the tracked event', () => {
    const track = vi.fn()
    taktStore.value = { track } as unknown as TaktInstance
    const { getByText } = render(() => (
      <TaktEvent name="Buy" props={{ plan: 'pro' }}>
        <button>Go</button>
      </TaktEvent>
    ))
    fireEvent.click(getByText('Go'))
    expect(track).toHaveBeenCalledWith('Buy', { props: { plan: 'pro' } })
  })

  it('warns for a non-element child', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(() => <TaktEvent name="X">plain text</TaktEvent>)
    expect(warn).toHaveBeenCalledWith(
      '[takt] <TaktEvent> expects a single element child; tracking is disabled.',
    )
    warn.mockRestore()
  })
})
