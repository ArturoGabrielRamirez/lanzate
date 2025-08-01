"use server"

import { /* PrismaClient, */ Store } from '@prisma/client'
import { actionWrapper, formatErrorResponse } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

type GetStoresFromUserReturn = {
    message: string
    payload: Store[]
    error: boolean
}

export async function getStoresFromUser(userId: number): Promise<GetStoresFromUserReturn> {
    return actionWrapper(async () => {

        /* const client = new PrismaClient() */

        const stores = await prisma.store.findMany({
            where: {
                OR: [
                    {
                        user_id: userId
                    },
                    {
                        employees: {
                            some: {
                                user_id: userId
                            }
                        }
                    }
                ]
            }
        })

        return {
            message: "Stores fetched successfully from db",
            payload: stores,
            error: false
        }

    })
}
