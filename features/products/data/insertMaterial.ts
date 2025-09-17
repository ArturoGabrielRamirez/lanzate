"use server"

import { prisma } from "@/utils/prisma"

export async function insertMaterial(payload: { label: string; image_url?: string, store_id: number }) {

  const existing = await prisma.material.findFirst({
    where: {
      label: payload.label,
      store_id: payload.store_id
    }
  })

  if (existing) throw new Error("Material already exists")

  const created = await prisma.store.update({
    where: {
      id: payload.store_id
    },
    data: {
      materials: {
        create: {
          label: payload.label,
          image_url: payload.image_url
        }
      }
    },
    include: {
      materials: true
    }
  })

  return { payload: created.materials, error: false, message: "ok" }

}


