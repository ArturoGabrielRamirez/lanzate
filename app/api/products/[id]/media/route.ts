import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/utils/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const productId = parseInt(resolvedParams.id)
    if (Number.isNaN(productId)) return NextResponse.json({ error: "ID de producto inválido" }, { status: 400 })

    const body = await req.json()
    const media = (body.media ?? []) as { url: string; type: "IMAGE" | "VIDEO"; sortOrder: number }[]
    const primaryIndex = (body.primaryIndex ?? null) as number | null

    if (!Array.isArray(media) || media.length === 0) {
      return NextResponse.json({ error: "No se proporcionó multimedia" }, { status: 400 })
    }

    const result = await prisma.$transaction(async (tx) => {
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
        await tx.product.update({ where: { id: productId }, data: { primary_media_id: primary.id } })
      }

      return { count: created.length }
    })

    return NextResponse.json({ success: true, ...result })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}


