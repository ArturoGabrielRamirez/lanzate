"use server"

import { actionWrapper } from "@/features/global/utils"
import { prisma } from "@/utils/prisma"

export async function canDeleteBranch(branchId: number, userId: number) {
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
        const isMainBranch = branch.is_main
        const canDelete = isOwner && !isMainBranch

        return {
            hasError: false,
            message: canDelete ? "El usuario puede eliminar la sucursal" : "El usuario no puede eliminar la sucursal",
            payload: canDelete
        }
    })
} 