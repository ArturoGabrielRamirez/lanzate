/**
 * Determines if internationalization should be applied to a given pathname
 * 
 * i18n is NOT applied to:
 * - API routes (/api/*)
 * - Next.js internal routes (/_next/*)
 * - Favicon requests
 * - Auth routes (/auth/*)
 * - Static files (files with extensions)
 * 
 * @param pathname - The URL pathname to check
 * @returns True if i18n should be applied, false otherwise
 */
export function shouldApplyI18n(pathname: string): boolean {
    return !(
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/favicon') ||
        pathname.startsWith('/auth/') ||
        pathname.includes('.')
    )
}