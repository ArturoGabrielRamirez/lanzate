"use server"

/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib";
import { prisma } from "@/utils/prisma"

export async function selectProductAmount(subdomain: string) {
    return actionWrapper(async () => {

        /* const prisma = new PrismaClient(); */

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
    })
}
