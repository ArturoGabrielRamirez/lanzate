"use server"

import { createServerSideClient } from "@/utils/supabase/server";
import { formatErrorResponse } from "@/utils/lib";
import { SelectStoreBySubdomainReturn } from "../types/types";

export async function selectStoreBySubdomain(subdomain: string): Promise<SelectStoreBySubdomainReturn> {
    try {
        const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
        
        const { data, error } = await (await createServerSideClient())
            .from('stores')
            .select('*')
            .eq('subdomain', sanitizedSubdomain)
            .single();

        if (error) {
            throw new Error(`Store not found: ${error.message}`);
        }

        return {
            message: "Store fetched successfully from db",
            payload: data,
            error: false
        };

    } catch (error) {
        return formatErrorResponse("Error fetching store from db", error, null);
    }
}