"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export async function checkUserOrderPermissions(userId: number) {
    return actionWrapper(async () => {
        // Check if user is admin of any store or has can_create_orders permission
        const storesWithPermissions = await prisma.store.findMany({
            where: {
                OR: [
                    { user_id: userId }, // User is admin (store owner)
                    {
                        employees: {
                            some: {
                                user_id: userId,
                                is_active: true,
                                can_create_orders: true
                            }
                        }
                    }
                ]
            },
            select: { id: true }
        })

        const canCreateOrders = storesWithPermissions.length > 0

        return {
            message: canCreateOrders ? "User has order creation permissions" : "User does not have order creation permissions",
            payload: canCreateOrders,
            error: false
        }
    })
} 