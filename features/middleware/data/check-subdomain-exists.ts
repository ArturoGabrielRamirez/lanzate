"use server";

import { formatServerResponse } from "@/features/global/utils";
import { ServerResponse } from "@/features/global/types";
import { createServerSideClient } from "@/lib/supabase";
import { sanitizeSubdomain } from "@/features/middleware/schemas";

/**
 * Checks if a subdomain exists in the database
 * 
 * @param subdomain - The subdomain to check
 * @returns Server response with boolean indicating if subdomain exists
 */
export async function checkSubdomainExists(
    subdomain: string
): Promise<ServerResponse<boolean>> {
    try {
        const sanitizedSubdomain = sanitizeSubdomain(subdomain);

        const { data, error } = await createServerSideClient()
            .from('stores')
            .select('id')
            .eq('subdomain', sanitizedSubdomain)
            .single();

        const exists = !error && data !== null;

        return {
            message: exists ? "Subdomain exists" : "Subdomain does not exist",
            payload: exists,
            hasError: false
        };

    } catch (error) {
        return formatServerResponse("Error checking subdomain existence", error);
    }
}