import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@solidjs/testing-library'

const { embedUrl } = vi.hoisted(() => ({
  embedUrl: vi.fn((domain: string, opts: Record<string, unknown>) => `/embed/${domain}?${JSON.stringify(opts)}`),
}))
vi.mock('@vskstudio/takt-core', () => ({ embedUrl }))

import { TaktEmbed } from '../src/TaktEmbed'

beforeEach(() => vi.clearAllMocks())

describe('TaktEmbed', () => {
  it('builds src from domain and all options, with defaults', () => {
    const { container } = render(() => <TaktEmbed domain="example.com" theme="dark" lang="en" host="https://t.io" />)
    const iframe = container.querySelector('iframe')!
    expect(embedUrl).toHaveBeenCalledWith('example.com', { host: 'https://t.io', theme: 'dark', lang: 'en' })
    expect(iframe.getAttribute('src')).toBe(embedUrl.mock.results[0]!.value)
    expect(iframe.getAttribute('title')).toBe('takt')
    expect(iframe.getAttribute('width')).toBe('404')
    expect(iframe.getAttribute('height')).toBe('264')
    expect(iframe.getAttribute('loading')).toBe('lazy')
    expect(iframe.getAttribute('referrerpolicy')).toBe('strict-origin-when-cross-origin')
  })

  it('does not let a consumer-passed src override the built URL', () => {
    const { container } = render(() => (
      // @ts-expect-error src is wrapper-controlled and omitted from props
      <TaktEmbed domain="example.com" src="https://evil.example/x" />
    ))
    const iframe = container.querySelector('iframe')!
    expect(iframe.getAttribute('src')).toBe(embedUrl.mock.results[0]!.value)
    expect(iframe.getAttribute('src')).not.toContain('evil')
  })
})
