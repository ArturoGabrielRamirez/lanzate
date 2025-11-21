"use server"

import { DeleteBranchDataProps } from "@/features/branches/types"
import { prisma } from "@/utils/prisma"

export async function deleteBranchData({ branchId }: DeleteBranchDataProps) {

    const branch = await prisma.branch.findUnique({
        where: {
            id: branchId
        }
    })

    if (!branch) throw new Error("Sucursal no encontrada")

    if (branch.is_main) {
        throw new Error("No se puede eliminar la sucursal principal. Debe designar otra sucursal como principal antes de eliminar esta.")
    }

    const deletedBranch = await prisma.branch.delete({
        where: {
            id: branchId
        }
    })

    return {
        hasError: false,
        message: "Sucursal eliminada con éxito",
        payload: deletedBranch
    }
} 