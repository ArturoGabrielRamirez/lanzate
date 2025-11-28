"use server"

import { prisma } from "@/utils/prisma"

export async function getStoresFromUserData(userId: number) {
    
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
        message: "Tiendas recuperadas con éxito",
        payload: stores,
        hasError: false
    }
}
