"use server";

import { actionWrapper } from "@/features/global/utils";
import { ServerResponse } from "@/features/global/types";
import { checkSubdomainExists } from "@/features/middleware/data";
import { subdomainSchema } from "@/features/middleware/schemas";
import { validateSubdomainAccess } from "@/features/middleware/access";

/**
 * Validates a subdomain by checking its format and existence in the database
 * 
 * @param subdomain - The subdomain to validate
 * @returns Server response with boolean indicating if subdomain is valid
 */
export async function validateSubdomain(
    subdomain: string
): Promise<ServerResponse<boolean>> {
    return await actionWrapper<boolean>(async () => {
        // First validate the subdomain format and access
        const accessValidation = await validateSubdomainAccess(subdomain);
        
        if (!accessValidation.isValid) {
            return {
                message: accessValidation.error || "Invalid subdomain format",
                payload: null,
                hasError: true
            };
        }

        // Then check if it exists in the database
        const { payload: exists, hasError, message } = await checkSubdomainExists(subdomain);

        if (hasError) {
            throw new Error(message);
        }

        return {
            message: exists ? "Subdomain is valid" : "Subdomain not found",
            payload: exists,
            hasError: false
        };
    });
}