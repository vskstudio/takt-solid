import { splitProps, type JSX } from 'solid-js'
import { badgeUrl, type BadgeVariant, type BadgeGlyph, type WidgetLang } from '@vskstudio/takt-core'

export interface TaktBadgeProps extends JSX.ImgHTMLAttributes<HTMLImageElement> {
  /** Site identifier whose badge to render. */
  domain: string
  variant?: BadgeVariant
  glyph?: BadgeGlyph
  lang?: WidgetLang
  /** Override the public host serving the badge SVG. */
  host?: string
}

export function TaktBadge(props: TaktBadgeProps): JSX.Element {
  const [own, rest] = splitProps(props, ['domain', 'variant', 'glyph', 'lang', 'host'])

  return (
    <img
      alt="takt"
      loading="lazy"
      decoding="async"
      {...rest}
      src={badgeUrl(own.domain, { host: own.host, variant: own.variant, glyph: own.glyph, lang: own.lang })}
    />
  )
}
