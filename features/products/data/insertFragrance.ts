"use server"

import { prisma } from "@/utils/prisma"

export async function insertFragrance(payload: { label: string, store_id: number }) {

  const existing = await prisma.fragrance.findFirst({
    where: {
      label: payload.label,
      store_id: payload.store_id
    }
  })

  if (existing) throw new Error("Fragrance already exists")

  const created = await prisma.store.update({
    where: {
      id: payload.store_id
    },
    data: {
      fragrances: {
        create: {
          label: payload.label
        }
      }
    },
    include: {
      fragrances: true
    }
  })

  return { payload: created.fragrances, error: false, message: "Fragrance created successfully" }
}


