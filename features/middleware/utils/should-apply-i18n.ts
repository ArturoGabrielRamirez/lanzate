export function shouldApplyI18n(pathname: string): boolean {
    return !(
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/favicon') ||
        pathname.startsWith('/auth/') ||
        pathname.includes('.')
    )
}