import { routing } from "@/i18n/routing";
import { LocaleExtractionResult } from "@/features/middleware/types";

/**
 * Extracts the locale from a URL pathname
 * 
 * @param pathname - The URL pathname (e.g., '/en/dashboard', '/es/products')
 * @returns Object containing the extracted locale and path without locale
 * 
 * @example
 * extractLocaleFromPath('/en/dashboard') // { locale: 'en', pathWithoutLocale: '/dashboard' }
 * extractLocaleFromPath('/dashboard') // { locale: null, pathWithoutLocale: '/dashboard' }
 */
export function extractLocaleFromPath(pathname: string): LocaleExtractionResult {
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