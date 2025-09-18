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

  const created = await prisma.material.create({
    data: {
      label: payload.label,
      image_url: payload.image_url,
      store_id: payload.store_id
    }
  })

  return { payload: created, error: false, message: "ok" }

}


