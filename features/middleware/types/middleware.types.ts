/**
 * Locale extraction result from URL path
 */
export interface LocaleExtractionResult {
    /**
     * The extracted locale code (e.g., 'en', 'es'), or null if not found
     */
    locale: string | null;
    
    /**
     * The path without the locale prefix
     */
    pathWithoutLocale: string;
}

/**
 * Session update context
 */
export interface SessionUpdateContext {
    subdomain: string | null;
    locale: string;
    pathWithoutLocale: string;
    hasUser: boolean;
}

