"use server"

import { prisma } from "@/utils/prisma"

export async function deleteMaterial(materialId: number, storeId: number) {

    const material = await prisma.material.findUnique({
        where: {
            id: materialId,
            store_id: storeId
        }
    })

    if (!material) throw new Error("Material not found")

    const deletedMaterial = await prisma.material.delete({
        where: {
            id: materialId,
            store_id: storeId
        }
    })

    return {
        error: false,
        message: "Material deleted successfully",
        payload: deletedMaterial
    }

}
