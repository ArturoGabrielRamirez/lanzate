"use server"

import { formatErrorResponse } from "@/utils/lib";
import { selectStoreWithProducts } from "../data/selectStoreWithProducts";
import { GetStoreWithProductsReturn } from "../types/types";


export async function getStoreWithProducts(subdomain: string, category: string | undefined = undefined, sort: string | undefined = undefined): Promise<GetStoreWithProductsReturn> {
    try {
        const { payload: storeData, error, message } = await selectStoreWithProducts(subdomain, category, sort);

        if (error) throw new Error(message);

        return {
            message: "Store with products fetched successfully",
            payload: storeData,
            error: false
        };

    } catch (error) {
        return formatErrorResponse("Error fetching store with products", error, null);
    }
}