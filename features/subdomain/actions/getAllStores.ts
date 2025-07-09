"use server"

import { formatErrorResponse } from "@/utils/lib";
import { selectAllStores } from "../data/selectAllStores";
import { GetAllStoresReturn } from "../types/types";

export async function getAllStores(): Promise<GetAllStoresReturn> {
    try {
        const { payload: stores, error, message } = await selectAllStores();

        if (error) throw new Error(message);

        return {
            message: "All stores fetched successfully",
            payload: stores,
            error: false
        };

    } catch (error) {
        return formatErrorResponse("Error fetching all stores", error, []);
    }
}