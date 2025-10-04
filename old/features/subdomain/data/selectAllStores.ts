"use server"

import { createServerSideClient } from "@/utils/supabase/server";
import { formatErrorResponse } from "@/utils/lib";
import { SelectAllStoresReturn } from "../types/types";

export async function selectAllStores(): Promise<SelectAllStoresReturn> {
    try {
        const { data, error } = await createServerSideClient()
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