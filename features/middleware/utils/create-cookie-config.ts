export function createCookieConfig() {
    return {
        domain: '.lanzate.app',
        secure: true,
        sameSite: 'none' as const
    }
}