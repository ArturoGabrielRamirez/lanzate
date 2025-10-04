"use server"

import { formatErrorResponse } from "@/utils/lib";
import { selectProductAmount } from "../data/selectProductAmount";

export async function getStoreProductAmount(subdomain: string) {
    try {
        const { payload: productAmount, error, message } = await selectProductAmount(subdomain);

        if (error) throw new Error(message);

        return {
            message: "Store product amount fetched successfully",
            payload: productAmount,
            error: false
        };
    } catch (error) {
        return formatErrorResponse("Error fetching store product amount", error, null);
    }
}
