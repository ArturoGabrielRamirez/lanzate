"use server";

import { subdomainSchema } from '@/features/middleware/schemas';

export async function validateSubdomainAccess(subdomain: string): Promise<{
    isValid: boolean;
    error?: string;
}> {
    try {
        const validation = subdomainSchema.safeParse(subdomain);

        if (!validation.success) {
            return {
                isValid: false,
                error: validation.error.message
            };
        }
        return {
            isValid: true
        };
    } catch (error) {
        console.error('Error validating subdomain access:', error);
        return {
            isValid: false,
            error: 'Error validating subdomain access'
        };
    }
}

