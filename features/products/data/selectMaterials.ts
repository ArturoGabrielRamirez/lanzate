"use server"

import { prisma } from "@/utils/prisma"

export async function selectMaterials({ store_id }: { store_id: number }) {

    const materials = await prisma.material.findMany({
        where: {
            store_id: store_id
        }
    })

    return {
        payload: materials,
        error: false,
        message: "Materials fetched successfully"
    }

}