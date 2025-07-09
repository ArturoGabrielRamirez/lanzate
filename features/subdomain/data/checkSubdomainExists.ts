import { createSupabaseClient } from "@/utils/supabase/client";
import { formatErrorResponse } from "@/utils/lib";

type CheckSubdomainExistsReturn = {
    message: string;
    payload: boolean;
    error: boolean;
};

export async function checkSubdomainExists(subdomain: string): Promise<CheckSubdomainExistsReturn> {
    try {
        const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
        
        const { data, error } = await (await createSupabaseClient())
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