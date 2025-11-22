"use server"

import { actionWrapper } from "@/features/global/utils"
import { prisma } from "@/utils/prisma"

export async function canEditBranch(branchId: number, userId: number) {
    return actionWrapper(async () => {

        const branch = await prisma.branch.findUnique({
            where: {
                id: branchId
            },
            include: {
                store: true
            }
        })

        if (!branch) throw new Error("Sucursal no encontrada")

        const isOwner = branch.store.user_id === userId

        return {
            hasError: false,
            message: isOwner ? "El usuario puede editar la sucursal" : "El usuario no puede editar la sucursal",
            payload: isOwner
        }
    })
} 