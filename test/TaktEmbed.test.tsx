import { describe, it, expect } from 'vitest'
import { render } from '@solidjs/testing-library'
import { TaktEmbed } from '../src/TaktEmbed'

describe('TaktEmbed', () => {
  it('renders an iframe whose src reflects the props', () => {
    const { container } = render(() => <TaktEmbed domain="example.com" theme="dark" lang="en" />)
    const iframe = container.querySelector('iframe')!
    expect(iframe.getAttribute('src')).toContain('embed/example.com')
    expect(iframe.getAttribute('src')).toContain('dark')
    expect(iframe.getAttribute('title')).toBe('takt')
    expect(iframe.getAttribute('width')).toBe('404')
    expect(iframe.getAttribute('height')).toBe('264')
    expect(iframe.getAttribute('loading')).toBe('lazy')
  })
})
