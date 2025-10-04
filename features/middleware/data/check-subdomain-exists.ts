"use server"

import { formatServerResponse } from "@/features/global/utils";
import { createServerSideClient } from "@/features/supabase/utils";

export async function checkSubdomainExists(subdomain: string): Promise<any> {
    try {
        const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

        const { data, error } = await createServerSideClient()
            .from('stores')
            .select('id')
            .eq('subdomain', sanitizedSubdomain)
            .single();

        const exists = !error && data !== null;

        return {
            message: exists ? "Subdomain exists" : "Subdomain does not exist",
            payload: exists,
            error: false
        };

    } catch (error) {
        return formatServerResponse("Error checking subdomain existence", error);
    }
}