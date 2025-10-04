import { z } from 'zod';

/**
 * Validation schema for subdomain strings
 * 
 * Rules:
 * - Minimum 3 characters
 * - Maximum 63 characters (DNS label limit)
 * - Only lowercase letters, numbers, and hyphens
 * - Cannot start or end with a hyphen
 * - Cannot contain consecutive hyphens
 */
export const subdomainSchema = z
    .string()
    .min(3, 'Subdomain must be at least 3 characters')
    .max(63, 'Subdomain must be less than 63 characters')
    .regex(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens')
    .refine((val) => !val.startsWith('-') && !val.endsWith('-'), {
        message: 'Subdomain cannot start or end with a hyphen'
    })
    .refine((val) => !val.includes('--'), {
        message: 'Subdomain cannot contain consecutive hyphens'
    })
    .refine((val) => {
        // Reserved subdomains
        const reserved = ['www', 'api', 'admin', 'app', 'mail', 'ftp', 'localhost'];
        return !reserved.includes(val);
    }, {
        message: 'This subdomain is reserved and cannot be used'
    });

/**
 * Type inference from the subdomain schema
 */
export type SubdomainInput = z.infer<typeof subdomainSchema>;

/**
 * Sanitizes a subdomain string by:
 * - Converting to lowercase
 * - Removing non-alphanumeric characters except hyphens
 * 
 * @param subdomain - The subdomain to sanitize
 * @returns The sanitized subdomain
 */
export function sanitizeSubdomain(subdomain: string): string {
    return subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
}

