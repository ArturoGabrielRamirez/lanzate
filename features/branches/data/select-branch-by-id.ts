"use server"

import { SelectBranchByIdProps } from "@/features/branches/types"
import { prisma } from "@/utils/prisma"

export async function selectBranchByIdData({ id }: SelectBranchByIdProps) {

    const branch = await prisma.branch.findUnique({
        where: {
            id: id
        },
        include: {
            store: {
                select: {
                    id: true,
                    name: true,
                    slug: true
                }
            },
         /*    stock: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            image: true
                        }
                    }
                }
            }, */
            orders: {
                select: {
                    id: true,
                    total_price: true,
                    status: true,
                    created_at: true
                },
                orderBy: {
                    created_at: 'desc'
                },
                take: 10
            }
        }
    })

    if (!branch) throw new Error("Sucursal no encontrada")

    return {
        payload: branch,
        hasError: false,
        message: "Detalles de la sucursal obtenidos con éxito"
    }
} 