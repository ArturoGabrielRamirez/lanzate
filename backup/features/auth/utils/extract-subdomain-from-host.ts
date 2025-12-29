export function extractSubdomainFromHost(host: string): string | null {
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'lanzate.app'

    if (host === rootDomain || host === `www.${rootDomain}`) {
        return null
    }

    const subdomain = host.replace(`.${rootDomain}`, '')
    return subdomain !== host ? subdomain : null
}