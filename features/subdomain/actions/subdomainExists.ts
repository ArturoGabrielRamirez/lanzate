import { createClient } from "@/utils/supabase/client";


export async function subdomainExists(subdomain: string): Promise<boolean> {
    const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

    try {
        const { data, error } = await createClient()
            .from('store')
            .select('id')
            .eq('subdomain', sanitizedSubdomain)
            .single();

        return !error && data !== null;
    } catch (error) {
        return false;
    }
}