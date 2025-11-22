"use server"

import { formatErrorResponse } from "@/features/global/utils";
import { selectStoreWithProductsData } from "@/features/stores/data/select-store-with-products.data";


export async function getStoreWithProductsAction(subdomain: string, category: string | undefined = undefined, sort: string | undefined = undefined, search: string | undefined = undefined, min: string | undefined = undefined, max: string | undefined = undefined, limit: number, page: number) {
    try {
        const { payload: storeData, hasError, message } = await selectStoreWithProductsData(subdomain, category, sort, search, min, max, limit, page);

        if (hasError) throw new Error(message);

        return {
            message: "Tienda con productos recuperada con éxito desde la base de datos",
            payload: storeData,
            hasError: false
        };

    } catch (error) {
        return formatErrorResponse("Error al recuperar la tienda con productos");
    }
}