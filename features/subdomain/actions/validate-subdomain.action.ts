"use server"

import { actionWrapper } from "@/features/global/utils";
import { checkSubdomainExistsData } from "@/features/subdomain/data/check-subdomain-exists.data";

export async function validateSubdomainAction(subdomain: string) {
    return actionWrapper(async () => {

        const { payload: exists, hasError, message } = await checkSubdomainExistsData(subdomain);

        if (hasError) throw new Error(message);

        return {
            message: exists ? "Subdomain is valid" : "Subdomain not found",
            payload: exists,
            hasError: false
        };

    });
}