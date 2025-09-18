"use server"

import { prisma } from "@/utils/prisma"

export async function deleteMaterial(materialLabel: string, storeId: number) {

    const material = await prisma.material.findUnique({
        where: {
            label: materialLabel,
            store_id: storeId
        }
    })

    if (!material) throw new Error("Material not found")

    const deletedMaterial = await prisma.material.delete({
        where: {
            label: materialLabel,
            store_id: storeId
        }
    })

    return {
        error: false,
        message: "Material deleted successfully",
        payload: deletedMaterial
    }

}
