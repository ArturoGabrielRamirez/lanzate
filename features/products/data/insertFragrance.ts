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

  const created = await prisma.fragrance.create({
    data: {
      label: payload.label,
      store_id: payload.store_id
    },
    select: {
      id: true,
      label: true
    }
  })

  return { payload: created, error: false, message: "Fragrance created successfully" }
}


