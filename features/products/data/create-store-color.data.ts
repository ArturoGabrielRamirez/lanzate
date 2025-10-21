"use server"

import { prisma } from "@/utils/prisma"

type Args = { name: string; hex: string }

export async function createStoreColor({ name, hex }: Args) {
    const created = await prisma.color.create({ data: { name, rgba: (JSON.stringify([0, 0, 0, 1]) as unknown as object) } })
    // Since schema has optional store_id, we omit it.
    return { error: false, message: "Color creado", payload: { id: created.id, name, hex } }
}


