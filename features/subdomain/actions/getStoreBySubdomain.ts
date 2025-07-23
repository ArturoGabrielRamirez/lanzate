"use server"

import { actionWrapper } from "@/utils/lib";
import { selectStoreBySubdomain } from "../data/selectStoreBySubdomain";
import { GetStoreBySubdomainReturn } from "../types/types";


export async function getStoreBySubdomain(subdomain: string): Promise<GetStoreBySubdomainReturn> {
    return actionWrapper(async () => {
        const { payload: store, error, message } = await selectStoreBySubdomain(subdomain);

        if (error) throw new Error(message);

        return {
            message: "Store fetched successfully",
            payload: store,
            error: false
        };

    });
}