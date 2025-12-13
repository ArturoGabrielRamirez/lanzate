"use server"

import { formatSuccessResponse } from "@/features/global/utils";
import { prisma } from "@/utils/prisma";

export async function checkSubdomainExistsData(subdomain: string) {

    const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

    const store = await prisma.store.findUnique({
        where: {
            subdomain: sanitizedSubdomain
        },
        select: {
            id: true
        }
    });

    const exists = store !== null;

    return formatSuccessResponse(exists ? "El subdominio existe" : "El subdominio no existe", exists);

}