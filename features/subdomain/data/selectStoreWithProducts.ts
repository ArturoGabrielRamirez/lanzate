import { createSupabaseClient } from "@/utils/supabase/client";
import { SubdomainData, StoreWithProducts } from "../types/types";
import { formatErrorResponse } from "@/utils/lib";

type SelectStoreWithProductsReturn = {
    message: string;
    payload: StoreWithProducts | null;
    error: boolean;
};

export async function selectStoreWithProducts(subdomain: string): Promise<SelectStoreWithProductsReturn> {
    try {
        const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
        
        const client = await createSupabaseClient();

        // Primero obtenemos la tienda
        const { data: store, error: storeError } = await client
            .from('stores')
            .select('id, name, subdomain, created_at')
            .eq('subdomain', sanitizedSubdomain)
            .single();

        if (storeError || !store) {
            throw new Error(`Store not found: ${storeError?.message || 'Unknown error'}`);
        }

        // Luego obtenemos los productos de esa tienda
        const { data: products, error: productsError } = await client
            .from('products')
            .select('*')
            .eq('store_id', store.id);

        if (productsError) {
            throw new Error(`Products not found: ${productsError.message}`);
        }

        return {
            message: "Store with products fetched successfully from db",
            payload: {
                store,
                products: products || []
            },
            error: false
        };

    } catch (error) {
        return formatErrorResponse("Error fetching store with products from db", error, null);
    }
}