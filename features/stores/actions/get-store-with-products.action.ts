"use server"

import { formatErrorResponse } from "@/features/global/utils";
import { selectStoreWithProductsData } from "@/features/stores/data/select-store-with-products.data";


export async function getStoreWithProductsAction(subdomain: string, category: string | undefined = undefined, sort: string | undefined = undefined, search: string | undefined = undefined, min: string | undefined = undefined, max: string | undefined = undefined, limit: number, page: number) {
    try {
        const { payload: storeData, hasError, message } = await selectStoreWithProductsData(subdomain, category, sort, search, min, max, limit, page);

        if (hasError) throw new Error(message);

        return {
            message: "Store with products fetched successfully",
            payload: storeData,
            hasError: false
        };

    } catch (error) {
        return formatErrorResponse("Error fetching store with products");
    }
}