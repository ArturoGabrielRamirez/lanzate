"use server"

import { prisma } from "@/utils/prisma"

type MediaInput = {
  url: string
  type: "IMAGE" | "VIDEO"
  sortOrder: number
}

export async function attachProductMedia(
  productId: number,
  media: MediaInput[],
  primaryIndex: number | null
) {
  return await prisma.$transaction(async (tx) => {
    const created = [] as { id: number; sort_order: number }[]

    for (const m of media) {
      const row = await tx.productMedia.create({
        data: {
          product_id: productId,
          type: m.type,
          url: m.url,
          sort_order: m.sortOrder,
        },
      })
      created.push({ id: row.id, sort_order: row.sort_order })
    }

    if (primaryIndex !== null && created.length > 0) {
      const primary = created.find((c) => c.sort_order === primaryIndex) ?? created[0]
      await tx.product.update({
        where: { id: productId },
        data: { primary_media_id: primary.id },
      })
    }

    return { count: created.length }
  })
}


