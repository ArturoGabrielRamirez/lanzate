"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"

export async function insertMaterial(payload: { label: string; image_url?: string }) {
  return actionWrapper(async () => {
    const existing = await prisma.material.findFirst({ where: { label: payload.label } })
    if (existing) return { payload: existing, error: false, message: "ok" }
    const created = await prisma.material.create({ data: { label: payload.label, image_url: payload.image_url } })
    return { payload: created, error: false, message: "ok" }
  })
}


