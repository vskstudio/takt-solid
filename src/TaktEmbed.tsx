import { splitProps, mergeProps, type JSX } from 'solid-js'
import { embedUrl, type EmbedTheme, type WidgetLang } from '@vskstudio/takt-core'

export interface TaktEmbedProps extends JSX.IframeHTMLAttributes<HTMLIFrameElement> {
  /** Site identifier whose embed to render. */
  domain: string
  theme?: EmbedTheme
  lang?: WidgetLang
  /** Override the public host serving the embed page. */
  host?: string
}

export function TaktEmbed(props: TaktEmbedProps): JSX.Element {
  const merged = mergeProps({ width: 404, height: 264, title: 'takt' }, props)
  const [own, rest] = splitProps(merged, ['domain', 'theme', 'lang', 'host'])

  return (
    <iframe
      loading="lazy"
      style={{ border: 0 }}
      {...rest}
      src={embedUrl(own.domain, { host: own.host, theme: own.theme, lang: own.lang })}
    />
  )
}
