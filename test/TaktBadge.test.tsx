import { describe, it, expect } from 'vitest'
import { render } from '@solidjs/testing-library'
import { TaktBadge } from '../src/TaktBadge'

describe('TaktBadge', () => {
  it('renders an img whose src reflects the props', () => {
    const { container } = render(() => (
      <TaktBadge domain="example.com" variant="d" glyph="dash" lang="fr" class="b" />
    ))
    const img = container.querySelector('img')!
    expect(img.getAttribute('src')).toContain('example.com')
    expect(img.getAttribute('src')).toContain('badge.svg')
    expect(img.getAttribute('alt')).toBe('takt')
    expect(img.getAttribute('loading')).toBe('lazy')
    expect(img.getAttribute('class')).toBe('b')
  })
})
