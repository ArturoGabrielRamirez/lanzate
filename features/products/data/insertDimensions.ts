"use server"

import { prisma } from "@/utils/prisma"

export async function insertDimensions(payload: { label: string; value?: number; unit?: string; store_id: number }) {

  const existing = await prisma.dimensions.findFirst({
    where: {
      label: payload.label,
      store_id: payload.store_id
    }
  })

  if (existing) throw new Error("Dimension already exists")

  const created = await prisma.dimensions.create({
    data: {
      label: payload.label,
      store_id: payload.store_id
    },
    select: {
      id: true,
      label: true
    }
  })

  return { payload: created, error: false, message: "ok" }
}


