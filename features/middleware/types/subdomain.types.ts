/**
 * Result of subdomain validation
 */
export interface SubdomainValidationResult {
    exists: boolean;
    subdomain: string;
}

/**
 * Configuration for subdomain routing
 */
export interface SubdomainRoute {
    /**
     * The path pattern to match (e.g., '/cart', '/checkout')
     */
    pattern: string;
    
    /**
     * The target path template (e.g., '/{locale}/s/{subdomain}/cart')
     */
    target: string;
}

/**
 * Options for extracting subdomain from request
 */
export interface SubdomainExtractionOptions {
    /**
     * Whether to include localhost subdomains
     */
    includeLocalhost?: boolean;
    
    /**
     * Whether to include Vercel preview deployments
     */
    includeVercelPreviews?: boolean;
}

/**
 * Cookie configuration for cross-subdomain authentication
 */
export interface CrossSubdomainCookieConfig {
    domain: string;
    secure: boolean;
    sameSite: 'lax' | 'strict' | 'none';
    path?: string;
}

