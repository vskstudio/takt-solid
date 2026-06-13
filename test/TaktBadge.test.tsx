import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@solidjs/testing-library'

const { badgeUrl } = vi.hoisted(() => ({
  badgeUrl: vi.fn((domain: string, opts: Record<string, unknown>) => `/public/${domain}/badge.svg?${JSON.stringify(opts)}`),
}))
vi.mock('@vskstudio/takt-core', () => ({ badgeUrl }))

import { TaktBadge } from '../src/TaktBadge'

beforeEach(() => vi.clearAllMocks())

describe('TaktBadge', () => {
  it('builds src from domain and all options, with defaults', () => {
    const { container } = render(() => (
      <TaktBadge domain="example.com" variant="d" glyph="dash" lang="fr" host="https://t.io" class="b" />
    ))
    const img = container.querySelector('img')!
    expect(badgeUrl).toHaveBeenCalledWith('example.com', { host: 'https://t.io', variant: 'd', glyph: 'dash', lang: 'fr' })
    expect(img.getAttribute('src')).toBe(badgeUrl.mock.results[0]!.value)
    expect(img.getAttribute('alt')).toBe('takt')
    expect(img.getAttribute('loading')).toBe('lazy')
    expect(img.getAttribute('decoding')).toBe('async')
    expect(img.getAttribute('class')).toBe('b')
  })

  it('does not let a consumer-passed src override the built URL', () => {
    const { container } = render(() => (
      // @ts-expect-error src is wrapper-controlled and omitted from props
      <TaktBadge domain="example.com" src="https://evil.example/x.svg" />
    ))
    const img = container.querySelector('img')!
    expect(img.getAttribute('src')).toBe(badgeUrl.mock.results[0]!.value)
    expect(img.getAttribute('src')).not.toContain('evil')
  })
})
