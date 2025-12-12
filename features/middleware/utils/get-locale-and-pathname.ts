import { Locale, routing } from '@/i18n/routing'

export function getLocaleAndPathname(pathname: string): { locale: string | null; pathWithoutLocale: string } {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  if (routing.locales.includes(firstSegment as Locale)) {
    const pathWithoutLocale = '/' + segments.slice(1).join('/')
    return {
      locale: firstSegment,
      pathWithoutLocale: pathWithoutLocale
    }
  }

  return {
    locale: routing.defaultLocale,
    pathWithoutLocale: pathname
  }
}