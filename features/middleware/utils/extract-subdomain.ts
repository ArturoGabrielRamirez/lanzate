import { APP_CONFIG } from "@/features/global/constants";
import { NextRequest } from "next/server";

/**
 * Extracts subdomain from the request hostname
 * 
 * Handles multiple scenarios:
 * - Localhost development (subdomain.localhost)
 * - Vercel preview deployments (subdomain---project.vercel.app)
 * - Production domains (subdomain.domain.com)
 * - Development/staging environments
 * 
 * @param request - Next.js request object
 * @returns The extracted subdomain or null if no subdomain found
 */
export function extractSubdomain(request: NextRequest): string | null {
    const host = request.headers.get('host') || '';
    const hostname = host.split(':')[0]; // Remove port if present

    // Handle localhost development
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
        // Check for subdomain.localhost pattern
        if (hostname.includes('.localhost')) {
            const subdomain = hostname.split('.')[0];
            return subdomain !== 'localhost' ? subdomain : null;
        }

        // Check for URL-based subdomain (like http://subdomain.localhost)
        const urlMatch = request.url.match(/https?:\/\/([^.]+)\.localhost/);
        if (urlMatch && urlMatch[1]) {
            return urlMatch[1];
        }

        return null;
    }

    // Handle Vercel preview deployments (subdomain---project.vercel.app)
    if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
        const parts = hostname.split('---');
        return parts.length > 0 ? parts[0] : null;
    }

    // Handle Vercel custom domains or other platforms
    if (hostname.endsWith('.vercel.app')) {
        return null; // No subdomain for main Vercel domain
    }

    // Split hostname into parts
    const parts = hostname.split('.');

    // Need at least 2 parts for a valid domain (subdomain.domain or domain.tld)
    if (parts.length < 2) {
        return null;
    }

    const rootDomainWithoutPort = APP_CONFIG.ROOT_DOMAIN.split(':')[0];

    // If hostname matches root domain exactly, no subdomain
    if (hostname === rootDomainWithoutPort || hostname === `www.${rootDomainWithoutPort}`) {
        return null;
    }

    // For production or when hostname ends with root domain
    if (hostname.endsWith(`.${rootDomainWithoutPort}`)) {
        const subdomain = hostname.replace(`.${rootDomainWithoutPort}`, '');
        return subdomain !== 'www' ? subdomain : null;
    }

    // For development/staging environments (like Caddy proxies)
    // Check if we have more parts than a typical domain (subdomain.something.tld)
    if (parts.length > 2) {
        // Common TLDs and development domains
        const commonDomains = [
            'com', 'net', 'org', 'app', 'dev', 'local', 'test', 'example',
            'localhost', 'internal', 'staging', 'prod'
        ];

        const lastPart = parts[parts.length - 1];
        if (commonDomains.includes(lastPart) || lastPart.length <= 4) {
            // Take the first part as subdomain if we have subdomain.domain.tld
            const potentialSubdomain = parts[0];
            return potentialSubdomain !== 'www' ? potentialSubdomain : null;
        }
    }

    // Fallback: if we have exactly 2 parts and it's not a known root domain,
    // treat the first part as subdomain (this helps with custom Caddy setups)
    if (parts.length === 2) {
        const potentialSubdomain = parts[0];
        // Only return if it looks like a subdomain (not www or the domain itself)
        if (potentialSubdomain !== 'www' &&
            !potentialSubdomain.includes('lanzate') &&
            potentialSubdomain.length > 0) {
            return potentialSubdomain;
        }
    }

    return null;
}