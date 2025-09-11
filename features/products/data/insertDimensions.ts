"use server"

import { prisma } from "@/utils/prisma"
import { actionWrapper } from "@/utils/lib"

export async function insertDimensions(payload: { label: string; value?: number; unit?: string }) {
  return actionWrapper(async () => {
    const existing = await prisma.dimensions.findFirst({ where: { label: payload.label } })
    if (existing) return { payload: existing, error: false, message: "ok" }
    const created = await prisma.dimensions.create({ data: { label: payload.label, value: payload.value, unit: payload.unit } })
    return { payload: created, error: false, message: "ok" }
  })
}


