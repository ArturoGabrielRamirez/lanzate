"use server"

import { prisma } from "@/utils/prisma"

export async function insertColor(payload: { name: string; value: string, store_id: number }) {

  const existing = await prisma.color.findFirst({
    where: {
      hex: payload.value,
      store_id: payload.store_id
    }
  })

  if (existing) throw new Error("This color already exists")

  const created = await prisma.store.update({
    where: {
      id: payload.store_id
    },
    data: {
      colors: {
        create: {
          name: payload.name,
          hex: payload.value
        }
      }
    },
    include: {
      colors: true
    },
  })

  return { payload: created.colors, error: false, message: "ok" }

}


