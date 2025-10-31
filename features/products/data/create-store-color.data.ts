"use server"

import { CreateStoreColorArgs } from "@/features/products/types"
import { prisma } from "@/utils/prisma"

export async function createStoreColorData({ name, hex }: CreateStoreColorArgs) {
    const created = await prisma.color.create({ data: { name, rgba: (JSON.stringify([0, 0, 0, 1]) as unknown as object) } })
    // Since schema has optional store_id, we omit it.
    return { hasError: false, message: "Color creado", payload: { id: created.id, name, hex } }
}


