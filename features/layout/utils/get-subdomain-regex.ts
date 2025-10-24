export function getSubdomainRegex(url: string) {
    try {
        const { hostname } = new URL(url);

        const parts = hostname.split('.');

        if (parts.length >= 3) {
            const subdomain = parts[0];

            if (subdomain === 'www') {
                return null;
            }
            return subdomain;
        }

        return null;
    } catch {
        return null;
    }
}

