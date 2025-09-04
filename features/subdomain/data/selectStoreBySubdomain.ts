"use server"

/* import { createServerSideClient } from "@/utils/supabase/server"; */
import { formatErrorResponse } from "@/utils/lib";
/* import { SelectStoreBySubdomainReturn } from "../types/types"; */
import { prisma } from "@/utils/prisma";
import { Branch, Store } from "@prisma/client";

type SelectStoreBySubdomainReturn = {
    message: string
    payload: Store & { branches: Branch[] } | null
    error: boolean
}

export async function selectStoreBySubdomain(subdomain: string): Promise<SelectStoreBySubdomainReturn> {
    try {

        const store = await prisma.store.findUnique({
            where: {
                subdomain: subdomain
            },
            include: {
                branches: true,
                products: {
                    where: {
                        is_deleted: false
                    },
                    include: {
                        categories: true,
                        stock_entries: true
                    }
                },
                balance: true,
                operational_settings: true
            }
        })

        /* const aggregate = await prisma.productStock.groupBy({
            by: ["branch_id"],
            _sum: {
                quantity: true
            },
            where: {
                product_id: {
                    in: store?.products.map((product) => product.id)
                }
            },
        })

        console.log(aggregate) */

        return {
            message: "Store fetched successfully from db",
            payload: store,
            error: false
        }

    } catch (error) {
        return formatErrorResponse("Error fetching store from db", error, null)
    }
}