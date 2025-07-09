import { createSupabaseClient } from "@/utils/supabase/client";
import { SubdomainData } from "../types/types";

export async function getAllSubdomains(): Promise<SubdomainData[]> {
    try {
        const { data, error } = await (await createSupabaseClient())
            .from('stores')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching all subdomains:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in getAllSubdomains:', error);
        return [];
    }
}