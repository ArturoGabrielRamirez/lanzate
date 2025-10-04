/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib"
import { GetSettingsReturn } from "@/features/settings/types"
import { prisma } from "@/utils/prisma"

export async function getStoreSettings(storeId: number): Promise<GetSettingsReturn> {
    return actionWrapper(async () => {
        /* const client = new PrismaClient() */

        let customization = await prisma.storeCustomization.findUnique({
            where: {
                store_id: storeId
            },
            include: {
                store: {
                    select: {
                        subdomain: true
                    }
                }
            }
        })

        // Si no existe, crear una con valores por defecto
        if (!customization) {
            customization = await prisma.storeCustomization.create({
                data: {
                    store_id: storeId,
                    // Los valores por defecto ya están definidos en el schema de Prisma
                },
                include: {
                    store: {
                        select: {
                            subdomain: true
                        }
                    }
                }
            })
        }

        return {
            message: "Settings retrieved successfully",
            payload: customization,
            error: false
        }
    })
} 