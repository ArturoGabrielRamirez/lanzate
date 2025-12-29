"use server"

import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

import { actionWrapper } from "@/features/global/utils"
import { PaymentFormType } from "@/features/stores/schemas"
import { mapPaymentMethodType } from "@/features/stores/utils/payment-helpers"
import { prisma } from "@/utils/prisma"

export async function updateStorePaymentMethodsAction(slug: string, data: PaymentFormType) {
    return actionWrapper(async () => {

        const store = await prisma.store.findUnique({
            where: { slug },
            select: { id: true }
        })

        if (!store) {
            throw new Error("Tienda no encontrada")
        }

        const mainBranch = await prisma.branch.findFirst({
            where: {
                store_id: store.id,
                is_main: true
            }
        })

        if (!mainBranch) {
            throw new Error("Sucursal principal no encontrada")
        }

        await prisma.branch.update({
            where: {
                id: mainBranch.id
            },
            data: {
                payment_configs: {
                    deleteMany: {},
                    create: data.payment_info.payment_methods?.map((pm) => ({
                        type: mapPaymentMethodType(pm.type),
                        name: pm.name,
                        commission_percent: pm.commission_percent || 0,
                        commission_amount: pm.commission_amount || 0,
                        is_active: true,
                        details: {
                            cbu: pm.cbu_cvu,
                            alias: pm.alias,
                            instructions: pm.instructions
                        } as Prisma.InputJsonValue
                    })) || []
                }
            }
        })

        revalidatePath(`/stores/${slug}`, "page")

        return {
            message: "Métodos de pago actualizados con éxito",
            hasError: false,
            payload: null
        }
    })
}

