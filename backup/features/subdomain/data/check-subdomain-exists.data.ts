"use server"

import { formatSuccessResponse } from "@/features/global/utils";
import { createServerSideClient } from "@/utils/supabase/server";

export async function checkSubdomainExistsData(subdomain: string) {

    const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

    const { data, error } = await createServerSideClient()
        .from('stores')
        .select('id')
        .eq('subdomain', sanitizedSubdomain)
        .single();

    const exists = !error && data !== null;

    return formatSuccessResponse(exists ? "El subdominio existe" : "El subdominio no existe", exists);

}