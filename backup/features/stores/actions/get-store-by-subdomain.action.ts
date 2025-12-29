"use server"

import { actionWrapper } from "@/features/global/utils";
import { selectStoreBySubdomainData } from "@/features/stores/data/select-store-by-subdomain.data";


export async function getStoreBySubdomainAction(subdomain: string) {
    return actionWrapper(async () => {
        const { payload: store, hasError, message } = await selectStoreBySubdomainData(subdomain);

        if (hasError) throw new Error(message);

        return {
            message: "Tienda recuperada con éxito desde la base de datos",
            payload: store,
            hasError: false
        };

    });
}