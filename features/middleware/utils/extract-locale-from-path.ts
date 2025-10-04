import { routing } from "@/i18n/routing";

export function extractLocaleFromPath(pathname: string): { locale: string | null; pathWithoutLocale: string } {
    const segments = pathname.split('/').filter(Boolean)
    const firstSegment = segments[0]

    if (routing.locales.includes(firstSegment as any)) {
        return {
            locale: firstSegment,
            pathWithoutLocale: '/' + segments.slice(1).join('/')
        }
    }

    return {
        locale: null,
        pathWithoutLocale: pathname
    }
}