"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"

export async function insertColor(payload: { name?: string; hex?: string }) {
  return actionWrapper(async () => {
    const where = payload.hex ? { hex: payload.hex } : undefined
    const existing = where ? await prisma.color.findFirst({ where }) : null
    if (existing) return { payload: existing, error: false, message: "ok" }
    const created = await prisma.color.create({ data: { name: payload.name || payload.hex || "", hex: payload.hex } })
    return { payload: created, error: false, message: "ok" }
  })
}


