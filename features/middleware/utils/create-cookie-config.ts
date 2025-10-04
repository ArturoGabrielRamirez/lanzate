import { APP_CONFIG } from '@/features/global/constants';
import { CrossSubdomainCookieConfig } from '@/features/middleware/types';

/**
 * Creates a cookie configuration for cross-subdomain authentication
 * 
 * @returns Cookie configuration object with domain, secure, and sameSite settings
 */
export function createCookieConfig(): CrossSubdomainCookieConfig {
    return {
        domain: APP_CONFIG.COOKIE_DOMAIN,
        secure: APP_CONFIG.IS_PRODUCTION,
        sameSite: APP_CONFIG.IS_PRODUCTION ? 'none' : 'lax',
        path: '/'
    };
}