"use server"

import { selectStoreWithProductsData } from "@/features/stores/data/select-store-with-products";
import { GetStoreWithProductsReturn } from "@/features/stores/types/types";
import { formatErrorResponse } from "@/utils/lib";


export async function getStoreWithProductsAction(subdomain: string, category: string | undefined = undefined, sort: string | undefined = undefined, search: string | undefined = undefined, min: string | undefined = undefined, max: string | undefined = undefined, limit: number, page: number): Promise<GetStoreWithProductsReturn> {
    try {
        const { payload: storeData, hasError, message } = await selectStoreWithProductsData(subdomain, category, sort, search, min, max, limit, page);

        if (hasError) throw new Error(message);

        return {
            message: "Store with products fetched successfully",
            payload: storeData,
            error: false
        };

    } catch (error) {
        return formatErrorResponse("Error fetching store with products", error, null);
    }
}