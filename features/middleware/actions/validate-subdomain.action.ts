"use server";

import type { ServerResponse } from "@/features/global/types";
import { actionWrapper } from "@/features/global/utils";
import { validateSubdomainAccess } from "@/features/middleware/access";
import { checkSubdomainExists } from "@/features/middleware/data";


export async function validateSubdomain(
    subdomain: string
): Promise<ServerResponse<boolean>> {
    return await actionWrapper<boolean>(async () => {
        const accessValidation = await validateSubdomainAccess(subdomain);

        if (!accessValidation.isValid) {
            return {
                message: accessValidation.error || "Invalid subdomain format",
                payload: null,
                hasError: true
            };
        }

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