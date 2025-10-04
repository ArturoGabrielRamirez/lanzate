"use server"

import { actionWrapper } from "@/features/global/utils";
import { checkSubdomainExists } from "@/features/middleware/data";

export async function validateSubdomain(subdomain: string): Promise<any> {
    return actionWrapper(async () => {
        const { payload: exists, error, message } = await checkSubdomainExists(subdomain);

        if (error) throw new Error(message);

        return {
            message: exists ? "Subdomain is valid" : "Subdomain not found",
            payload: exists,
            error: false
        };

    });
}