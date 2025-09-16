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

  const created = await prisma.store.update({
    where: {
      id: payload.store_id
    },
    data: {
      sizes: {
        create: {
          label: payload.label
        }
      }
    },
    include: {
      sizes: true
    }
  })

  return { payload: created.sizes, error: false, message: "Size created successfully" }
}


