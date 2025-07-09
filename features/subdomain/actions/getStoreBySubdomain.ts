"use server"

import { formatErrorResponse } from "@/utils/lib";
import { selectStoreBySubdomain } from "../data/selectStoreBySubdomain";
import { GetStoreBySubdomainReturn } from "../types/types";


export async function getStoreBySubdomain(subdomain: string): Promise<GetStoreBySubdomainReturn> {
    try {
        const { payload: store, error, message } = await selectStoreBySubdomain(subdomain);

        if (error) throw new Error(message);

        return {
            message: "Store fetched successfully",
            payload: store,
            error: false
        };

    } catch (error) {
        return formatErrorResponse("Error fetching store", error, null);
    }
}