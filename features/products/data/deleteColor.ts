"use server"

import { prisma } from "@/utils/prisma"

export async function deleteColor(colorHex: string, storeId: number) {

    const color = await prisma.color.findUnique({
        where: {
            hex: colorHex,
            store_id: storeId
        }
    })

    if (!color) throw new Error("Color not found")

    const deletedColor = await prisma.color.delete({
        where: {
            hex: colorHex,
            store_id: storeId
        }
    })


    return {
        error: false,
        message: "Color deleted successfully",
        payload: deletedColor
    }

}
