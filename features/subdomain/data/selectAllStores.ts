import { createSupabaseClient } from "@/utils/supabase/client";
import { SubdomainData } from "../types/types";
import { formatErrorResponse } from "@/utils/lib";

type SelectAllStoresReturn = {
    message: string;
    payload: SubdomainData[];
    error: boolean;
};

export async function selectAllStores(): Promise<SelectAllStoresReturn> {
    try {
        const { data, error } = await (await createSupabaseClient())
            .from('stores')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Error fetching stores: ${error.message}`);
        }

        return {
            message: "All stores fetched successfully from db",
            payload: data || [],
            error: false
        };

    } catch (error) {
        return formatErrorResponse("Error fetching all stores from db", error, []);
    }
}