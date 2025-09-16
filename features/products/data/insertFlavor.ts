"use server"

import { prisma } from "@/utils/prisma"

export async function insertFlavor(payload: { label: string, store_id: number }) {

  const existing = await prisma.flavor.findFirst({
    where: {
      label: payload.label,
      store_id: payload.store_id
    }
  })

  if (existing) throw new Error("Flavor already exists")

  const created = await prisma.store.update({
    where: {
      id: payload.store_id
    },
    data: {
      flavors: {
        create: {
          label: payload.label
        }
      }
    },
    include: {
      flavors: true
    }
  })

  return { payload: created.flavors, error: false, message: "ok" }
}


