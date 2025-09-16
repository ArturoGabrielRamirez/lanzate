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

  const created = await prisma.store.update({
    where: {
      id: payload.store_id
    },
    data: {
      dimensions: {
        create: {
          label: payload.label,
          value: payload.value,
          unit: payload.unit
        }
      }
    },
    include: {
      dimensions: true
    }
  })
  return { payload: created.dimensions, error: false, message: "ok" }
}


