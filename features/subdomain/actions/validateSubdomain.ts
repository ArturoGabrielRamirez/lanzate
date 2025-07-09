"use server"

import { formatErrorResponse } from "@/utils/lib";
import { checkSubdomainExists } from "../data/checkSubdomainExists";
import { ValidateSubdomainReturn } from "../types/types";

export async function validateSubdomain(subdomain: string): Promise<ValidateSubdomainReturn> {
    try {
        const { payload: exists, error, message } = await checkSubdomainExists(subdomain);

        if (error) throw new Error(message);

        return {
            message: exists ? "Subdomain is valid" : "Subdomain not found",
            payload: exists,
            error: false
        };

    } catch (error) {
        return formatErrorResponse("Error validating subdomain", error, false);
    }
}