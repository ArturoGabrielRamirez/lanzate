"use server"

import { Store, Branch } from '@prisma/client'
import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

type GetStoresFromUserReturn = {
    message: string
    payload: (Store & { branches: Branch[], _count: { products: number } })[]
    error: boolean
}

export async function getStoresFromUser(userId: number): Promise<GetStoresFromUserReturn> {
    return actionWrapper(async () => {

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
            },
            include: {
                branches: true,
                _count: {
                    select: {
                        products: true
                    }
                }
            }
        })

        return {
            message: "Stores fetched successfully from db",
            payload: stores,
            error: false
        }

    })
}
