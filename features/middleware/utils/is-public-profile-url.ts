export function isPublicProfileUrl(pathWithoutLocale: string): boolean {
    return pathWithoutLocale.match(/^\/u\/[a-zA-Z0-9_-]+$/) !== null
}