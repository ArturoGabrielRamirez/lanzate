"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"
import { revalidatePath } from "next/cache"

type Args = { name: string; hex: string }

export async function createStoreColor({ name, hex }: Args) {
    return actionWrapper(async () => {
        // find any store by context? For now attach to first store of the owner of the product via color uniqueness per store is not enforced here.
        // In variant context we don't have store id, so allow global color without store. If schema requires store_id, try to infer from latest product.
        const created = await prisma.color.create({ data: { name, rgba: (JSON.stringify([0,0,0,1]) as unknown as object) } })
        // Since schema has optional store_id, we omit it.
        revalidatePath(`/stores`)
        return { error: false, message: "Color creado", payload: { id: created.id, name, hex } }
    })
}


