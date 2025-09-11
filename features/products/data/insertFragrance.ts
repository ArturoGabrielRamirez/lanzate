"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"

export async function insertFragrance(payload: { label: string }) {
  return actionWrapper(async () => {
    const existing = await prisma.fragrance.findFirst({ where: { label: payload.label } })
    if (existing) return { payload: existing, error: false, message: "ok" }
    const created = await prisma.fragrance.create({ data: { label: payload.label } })
    return { payload: created, error: false, message: "ok" }
  })
}


