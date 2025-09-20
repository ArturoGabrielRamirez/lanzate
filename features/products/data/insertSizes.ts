"use server"

import { prisma } from "@/utils/prisma"

export async function insertSizes(payload: { label: string, store_id: number }) {

  const existing = await prisma.sizes.findFirst({
    where: {
      label: payload.label,
      store_id: payload.store_id
    }
  })

  if (existing) throw new Error("Size already exists")

  const created = await prisma.sizes.create({
    data: {
      label: payload.label,
      store_id: payload.store_id
    },
    select: {
      id: true,
      label: true
    }
  })

  return { payload: created, error: false, message: "Size created successfully" }
}