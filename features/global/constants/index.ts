/**
 * Application-wide configuration constants
 */
export const APP_CONFIG = {
    /**
     * The root domain of the application
     */
    ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'lanzate.app',
    
    /**
     * Cookie domain for cross-subdomain authentication
     * Prefixed with a dot to make it accessible across all subdomains
     */
    COOKIE_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN 
        ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` 
        : '.lanzate.app',
    
    /**
     * Protocol to use based on environment
     */
    PROTOCOL: process.env.NODE_ENV === 'production' ? 'https' : 'http',
    
    /**
     * Whether the app is running in production
     */
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    
    /**
     * Whether the app is running in development
     */
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
} as const;

/**
 * @deprecated Use APP_CONFIG.ROOT_DOMAIN instead
 */
export const ROOT_DOMAIN = APP_CONFIG.ROOT_DOMAIN;

/**
 * @deprecated Use APP_CONFIG.PROTOCOL instead
 */
export const PROTOCOL = APP_CONFIG.PROTOCOL;