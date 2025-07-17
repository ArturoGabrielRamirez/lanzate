"use server"

import { PrismaClient } from "@/prisma/generated/prisma";
import { formatErrorResponse } from "@/utils/lib";

export async function selectProductAmount(subdomain: string) {
    try {

        const prisma = new PrismaClient();

        const productAmount = await prisma.product.count({
            where: {
                store: {
                    subdomain: subdomain
                }
            }
        });

        return {
            message: "Product amount fetched successfully",
            payload: productAmount || 0,
            error: false
        };
    } catch (e) {
        return formatErrorResponse("Error fetching product amount", e, null);
    }
}
