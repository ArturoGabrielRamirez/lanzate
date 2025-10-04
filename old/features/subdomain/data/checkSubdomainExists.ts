"use server"

import { createServerSideClient } from "@/utils/supabase/server";
import { formatErrorResponse } from "@/utils/lib";
import { CheckSubdomainExistsReturn } from "../types/types";

export async function checkSubdomainExists(subdomain: string): Promise<CheckSubdomainExistsReturn> {
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
        return formatErrorResponse("Error checking subdomain existence", error, false);
    }
}